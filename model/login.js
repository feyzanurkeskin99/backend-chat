const  Sequelize= require('sequelize');
const sequelize = require('../config/database');

const Login = sequelize.define('user_login', {
    Id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    Name:Sequelize.STRING,
    Email:Sequelize.STRING,
    Token:Sequelize.TEXT,
},
{
    tableName: 'user_login',
    freezeTableName: true,
    timestamps:false
});


module.exports=  Login;