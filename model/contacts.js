const  Sequelize= require('sequelize');
const sequelize = require('../config/database');

const Contacts = sequelize.define('contacts', {
    Id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    Name:Sequelize.STRING,
    Email:Sequelize.STRING,
    ToName:Sequelize.STRING,
    ToEmail:Sequelize.STRING,
},
{
    tableName: 'contacts',
    freezeTableName: true,
    timestamps:false
});


module.exports=  Contacts;