const User = require('../model/signUp');
const Login = require('../model/login');
const Messages = require('../model/messages');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const save = require('save-file')

const fileSaver    = require('file-saver');
const Lame = require("node-lame").Lame;
const express = require('express');
const app=express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { default: slugify } = require('slugify');
const io = new Server(server);
const fs = require('fs');


io.on('connection', (socket)=>{
  socket.emit('disconnect_socket', {Status: false});
  console.log('connection oldu')
  //socket.on kodunda ilk parametre app kısmında sockete gönderdiğimiz verinin key adı olmalı(key-value mantığı)
  socket.on('dataMsg',(data)=>{
      let MessagesData = data;

      const user = User.findOne({
        where: {Email : MessagesData.email}
      });

      const login = Login.findOne({
        where: {Email : MessagesData.email}
      });


      try{
        if (user && login) {

          if(Buffer.isBuffer(data.msg)){
            // var mp3Blob = new Blob(data.msg, {type: 'audio/mp3'});
            // var bUrl = window.URL.createObjectURL(mp3Blob);
            // console.log(bUrl)
            console.log(data.msg)
        
                // return;

              let date = data.date
              date= date.split(" ")
            try {

              const encoder = new Lame({
                  "output": 'Voices/'+data.name+'/'+slugify(data.to+'-'+date[0]+'+'+date[1]+'+'+date[2]+'-'+data.time)+'.mp3',
                  "bitrate": 192
              }).setBuffer(data.msg);
              
              encoder.encode()
                  .then(() => {
                      console.log("success")
                  })
                  .catch((error) => {
                      console.log("error")
                      console.log(error)
                  });



              //fs.writeFileSync('Voices/'+data.name+'/'+slugify(data.to+'-'+date[0]+'+'+date[1]+'+'+date[2]+'-'+data.time)+'.mp3', data.msg)
              //save(data.msg, 'Voices/'+data.name+'/'+slugify(data.to+'-'+date[0]+'+'+date[1]+'+'+date[2]+'-'+data.time)+'.mp3')
            } catch (error) {
              console.log("<<<<<")
              console.log(error)
              console.log("<<<<<")
            }

            
            // const blob = new Blob(MessagesData.msg, {type: "audio/*;charset=utf-8"}); 
            // fileSaver.saveAs(blob, 'sound.mp3');
            // audioEncoder(audioBuffer, 128, null, onComplete=(blob)=> {
            // fileSaver.saveAs(blob, 'sound.mp3');
            // })
            let messagesData = {
              Message: 'Voices/'+data.name+'/'+slugify(data.to+'-'+date[0]+'+'+date[1]+'+'+date[2]+'-'+data.time)+'.mp3',
              Email: MessagesData.email,
              Name: MessagesData.name,
              Date: MessagesData.date,
              Time: MessagesData.time,
              ToName: MessagesData.to,
              ToEmail: MessagesData.toEmail
            };
            
              socket.broadcast.emit('message', { text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});     
              socket.emit('message', {text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});
              //console.log(messagesData)
              Messages.create(messagesData)
          }else{
            
            //işlemleri yap
            //console.log("--------------")
            //console.log(data)
            //console.log("---------------")
            let messagesData = {
              Message: MessagesData.msg,
              Email: MessagesData.email,
              Name: MessagesData.name,
              Date: MessagesData.date,
              Time: MessagesData.time,
              ToName: MessagesData.to,
              ToEmail: MessagesData.toEmail
            };
            
              socket.broadcast.emit('message', { Message: `${data.msg}`, Email:data.email, Name:data.name, Time:data.time, Date:data.date, ToName:data.to, ToEmail:data.toEmail});     
              socket.emit('message', {Message: `${data.msg}`, Email:data.email, Name:data.name, Time:data.time, Date:data.date, ToName:data.to, ToEmail:data.toEmail});
              //console.log(messagesData)
              Messages.create(messagesData)
              // .then((result)=>{
              //   res.status(200).json({
              //       status: true,
              //       statusCode: 200,
              //       message: "User is successfully logged in",
              //       data: messagesData,
              //   }); 
              // })
              // .catch((err)=>{
              //   res.status(300).json({
              //       status: false,
              //       statusCode: 300,
              //       message: "User isn't successfully logged in",
              //       err:err
              //   }); 
              //     console.log(err)
              // });
       
          }
          
        }else{
          // if (!login) {
          //   res.status(313).json({
          //     status: false,
          //     statusCode: 313,
          //     message: "User isn't logged in"
          //   }); 
          // }else if(!user){
          //   res.status(314).json({
          //     status: false,
          //     statusCode: 314,
          //     message: "User doesn't exist"
          //   }); 
          // }else{
          //   res.status(315).json({
          //     status: false,
          //     statusCode: 315,
          //     message: "I don't know why?"
          //   }); 
          // }
        }
        }catch(err){
            console.log(err)
        }
  })
  socket.on('disconnect', function () {
    socket.emit('disconnect_socket', {Status: true});
    socket.on('disconnect_user', (data) => {
      socket.emit('disconnect_user', {Email: data.Email});
      console.log("disconnect data")
      console.log(data)
      console.log("disconnect data")
    })
    console.log('socket disconnected ')
})
socket.on('call', (data)=>{
  socket.emit('joined-call',{
    Email: data.Email,
    ToEmail: data.ToEmail
  })
  socket.broadcast.emit('joined-call',{
    Email: data.Email,
    ToEmail: data.ToEmail
  })
})
socket.on('rejectCall', (data)=>{
  socket.emit('reject-call',{
    Email: data.Email,
    ToEmail: data.ToEmail
  })
  socket.broadcast.emit('reject-call',{
    Email: data.Email,
    ToEmail: data.ToEmail
  })
})
});

module.exports.delete = async function (req, res) {
  
  try {
    if(req.query.toEmail){
      messages = await Messages.findAll({
        where: {
  
          [Op.or]: [
            {  Email : req.query.email  ,
              ToEmail: req.query.toEmail},
            {  Email : req.query.toEmail,
              ToEmail: req.query.email }
          ]
        }
      })
      messages.forEach(msg => {
        msg.destroy()
      })
    }else{
      let deleteData = JSON.parse(req.body.Delete)
      message = await Messages.findOne({
        where: {
              Email : deleteData.Email  ,
              ToEmail: deleteData.ToEmail,
              Time: deleteData.Time
        }
      })
      message.destroy()
      .then((result)=>{
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "User is successfully deleted"
        }); 
      })
      .catch((err)=>{
        res.status(300).json({
            status: false,
            statusCode: 300,
            message: "User isn't successfully deleted"
        }); 
          console.log(err)
      });
    }
  } catch (error) {
    console.log(error)
  }
}

//mesaj detayına girince ilk istek atılan metod
module.exports.index = async function (req, res) {
  let messagesLength =0
  let contact=[]
  let newMessages= []
  let obj={};
  let limit = parseInt(req.query.limit)
  try {
    if( req.query.toEmail ){
      messages = await Messages.findAll({
        where: {
          [Op.or]: [
            {  Email : req.query.email  ,
              ToEmail: req.query.toEmail},
            {  Email : req.query.toEmail,
              ToEmail: req.query.email }
          ]
        }
      }) // burada messages dizisine tüm mesajları atadım
      
      {messages.forEach((msg, index) =>{
        if(index >= (messages.length - limit)){
          newMessages.push(msg)
        }
      })}
      
  
      res.json(newMessages);
  
    }else{ //chat list için çalışan kısım
      {messages = await Messages.findAll({
        where: {
    
          [Op.or]: [
            {  Email : req.query.email },
            {  ToEmail: req.query.email }
          ]
        }
      })}
      
        
      const indexNew = messages.length - 1
  
      {
        messages.forEach((msg, index) =>{
          newMessages[indexNew - index] = msg
        })
      }
  
      {  newMessages.forEach(msg => {
        if(msg.Email === req.query.email){
          obj.Email=msg.ToEmail
          obj.ToName=msg.ToName
          obj.Message=msg.Message
          obj.Status=true
        }else if( msg.ToEmail === req.query.email){
          obj.Email=msg.Email
          obj.ToName=msg.Name
          obj.Message=msg.Message
          obj.Status=false
        }
        
        console.log(contact.find(item=>item.Email==obj.Email) ? 
        true 
        :
        contact.push(obj)
        )
      obj={}
      newMessages=contact
      })}
  }
  console.log(newMessages)
  
    //res.status(200).json({
    //  status: true,
    //  statusCode: 200,
    //  message: "messages successfully load in",
    //  data:newMessages
    //}); 
    //return;
    res.json(newMessages);
  } catch (error) {
    console.log(error)
  }

  
};

// module.exports.post = async function (req, res) {

//   io.on('connection', (socket)=>{
//     console.log('connection oldu')
//     //socket.on kodunda ilk parametre app kısmında sockete gönderdiğimiz verinin key adı olmalı(key-value mantığı)
//     socket.on('dataMsg',(data)=>{
//         let MessagesData = data;

//         const user = User.findOne({
//           where: {Email : MessagesData.Email}
//         });
     
//         const login = Login.findOne({
//           where: {Email : MessagesData.Email}
//         });
  
     
//         try{
//           if (user && login) {
//             //işlemleri yap
//             let messagesData = {
//               Message: MessagesData.Message,
//               Email: MessagesData.Email,
//               Name: MessagesData.Name,
//               Date: MessagesData.date,
//               Time: MessagesData.Time,
//               ToName: MessagesData.ToName,
//               ToEmail: MessagesData.ToEmail
//             };
//               console.log(messagesData)
//               Messages.create(messagesData)
//               .then((result)=>{
//                 res.status(200).json({
//                     status: true,
//                     statusCode: 200,
//                     message: "User is successfully logged in",
//                     data: messagesData,
//                 }); 
//               })
//               .catch((err)=>{
//                 res.status(300).json({
//                     status: false,
//                     statusCode: 300,
//                     message: "User isn't successfully logged in",
//                     err:err
//                 }); 
//                   console.log(err)
//               });
         
//           }else{
//             if (!login) {
//               res.status(313).json({
//                 status: false,
//                 statusCode: 313,
//                 message: "User isn't logged in"
//               }); 
//             }else if(!user){
//               res.status(314).json({
//                 status: false,
//                 statusCode: 314,
//                 message: "User doesn't exist"
//               }); 
//             }else{
//               res.status(315).json({
//                 status: false,
//                 statusCode: 315,
//                 message: "I don't know why?"
//               }); 
//             }
//           }
//           }catch(err){
//               console.log(err)
//           }
//     })
//   });


  

// };


server.listen(3001, ()=>{
  console.log(`server is running port: http://localhost:${3001}`); 
})