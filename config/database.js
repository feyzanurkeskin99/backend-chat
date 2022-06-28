const Sequelize = require('sequelize');
module.exports = new Sequelize('socket_chatapp', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

