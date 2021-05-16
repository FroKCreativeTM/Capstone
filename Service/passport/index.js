const passport = require('passport');
const local = require('./localStrategy');
const Sequelize=require('sequelize');
const User = require('../models/user');

module.exports = () =>{
    passport.serializeUser((user, done) =>{
        done(null, user.idusers);
    });

    passport.deserializeUser((idusers, done) =>{
        User.findOne({where: { idusers } })
         .then(user => done(null, user))
         .catch(err => done(err));
    });

    local();
};