const User = require('../model/signUp');
const Login = require('../model/login');
const Messages = require('../model/messages');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const save = require('save-file')

const fileSaver    = require('file-saver');

const express = require('express');
const app=express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let message=[]
io.on('connection', (socket)=>{
  
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
        
            // return;
            let date = data.date
            date= date.split(" ")
            console.log(date)
            save(data.msg, 'Voices/'+data.name+'-'+date[0]+'+'+date[1]+'+'+date[2]+'-'+data.time+'.mp3')
            // const blob = new Blob(MessagesData.msg, {type: "audio/*;charset=utf-8"}); 
            // fileSaver.saveAs(blob, 'sound.mp3');
            // audioEncoder(audioBuffer, 128, null, onComplete=(blob)=> {
            // fileSaver.saveAs(blob, 'sound.mp3');
            // })
            let messagesData = {
              Message: "MessagesData.msg",
              Email: MessagesData.email,
              Name: MessagesData.name,
              Date: MessagesData.date,
              Time: MessagesData.time,
              ToName: MessagesData.to,
              ToEmail: MessagesData.toEmail
            };
            
              socket.broadcast.emit('message', { text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});     
              socket.emit('message', {text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});
              console.log(messagesData)
              Messages.create(messagesData)
          }else{
            
            //işlemleri yap
            console.log("--------------")
            console.log(data)
            console.log("---------------")
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
              console.log(messagesData)
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
    console.log('socket disconnected ')
})

});

module.exports.delete = async function (req, res) {
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
}

module.exports.index = async function (req, res) {
  let messages=[]
  let contact=[]
  let obj={};
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
    })
  }else{ 
    {messages = await Messages.findAll({
      where: {
  
        [Op.or]: [
          {  Email : req.query.email },
          {  ToEmail: req.query.email }
        ]
      }
    })}
    {  messages.forEach(msg => {
      if(msg.Email === req.query.email){
        obj.Email=msg.ToEmail
        obj.ToName=msg.ToName
      }else if( msg.ToEmail === req.query.email){
        obj.Email=msg.Email
        obj.ToName=msg.Name
      }
  
      console.log(contact.find(item=>item.Email==obj.Email) ? 
      true 
      :
      contact.push(obj)
      )
    obj={}
    messages=contact
    })}
}

  console.log("All messages:", JSON.stringify(messages, null, 2));
  console.log("contacts:", JSON.stringify(contact, null, 2));
  
  res.json(messages);

  
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