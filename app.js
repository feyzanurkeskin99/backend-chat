const express = require('express');
const http = require('http');
const app=express();
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./config/database');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const server = http.createServer(app);
 const { Server } = require("socket.io");
 const io = new Server(server);

// app.get('/', (req,res)=>{
//     res.send('Socket server')
// });

// io.on('connection', (socket)=>{
//   console.log('connection oldu')
//   //socket.on kodunda ilk parametre app kısmında sockete gönderdiğimiz verinin key adı olmalı(key-value mantığı)
//   socket.on('dataMsg',(data)=>{
//       console.log(data)
//       //veri kendi dışındaki tüm herkese gidiyor.
//       socket.broadcast.emit('message', { text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});

//       //verinin kendine de gelmesini istersek broadcast'i siliyoruz.
//       socket.emit('message', {text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});
//   })
// });

// server.listen(3001, ()=>{
//   console.log(`server is running port: http://localhost:${3001}`); 
// })

app.use(bodyParser.urlencoded({     extended:true})); 
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 ,// For legacy browser support
    methods: "GET, PUT ,POST ,DELETE"
};


app.use(cors(corsOptions));
require('./router/routerManager')(app,io);

//Database
db.authenticate()
.then(()=> console.log(' Database connected...'))
.catch(err => console.log ('error: ' +err))



module.exports=app;
