const Sequelize = require('sequelize');
const User = require('./user');
const video = require('./video');
const crime = require('./crime');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.video = video;
db.crime = crime;

User.init(sequelize);
video.init(sequelize);
crime.init(sequelize);

User.associate(db);
video.associate(db);
crime.associate(db);

module.exports = db;