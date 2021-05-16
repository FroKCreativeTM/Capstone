const passport = require('passport');
const local = require('./localStrategy');
<<<<<<< HEAD
=======
const Sequelize=require('sequelize');
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
const User = require('../models/user');

module.exports = () =>{
    passport.serializeUser((user, done) =>{
<<<<<<< HEAD
        done(null, user.id);
    });

    passport.deserializeUser((id, done) =>{
        User.findOne({where: { id } })
=======
        done(null, user.idusers);
    });

    passport.deserializeUser((idusers, done) =>{
        User.findOne({where: { idusers } })
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
         .then(user => done(null, user))
         .catch(err => done(err));
    });

    local();
};