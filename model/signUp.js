const  Sequelize= require('sequelize');
const sequelize = require('../config/database');

const SignUp = sequelize.define('user_signup', {
    Id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    Name:Sequelize.STRING,
    Email:Sequelize.STRING,
    Password:Sequelize.STRING
},
{
    tableName: 'user_signup',
    freezeTableName: true,
    timestamps:false
});


module.exports=  SignUp;