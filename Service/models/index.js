const Sequelize = require('sequelize');
<<<<<<< HEAD
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const User = require('./user');
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;

User.init(sequelize);
=======
const User = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;

User.init(sequelize);

>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
User.associate(db);

module.exports = db;