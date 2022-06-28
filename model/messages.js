const  Sequelize= require('sequelize');
const sequelize = require('../config/database');

const Messages = sequelize.define('messages', {
    Id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    Message:Sequelize.STRING,
    Email:Sequelize.STRING,
    Name:Sequelize.STRING,
    Date:Sequelize.STRING,
    Time:Sequelize.STRING,
    ToName:Sequelize.STRING,
    ToEmail:Sequelize.STRING,
},
{
    tableName: 'messages',
    freezeTableName: true,
    timestamps:false
});


module.exports=  Messages;