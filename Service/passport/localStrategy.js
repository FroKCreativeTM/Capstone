const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

<<<<<<< HEAD
=======

>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
const User = require('../models/user');

module.exports=()=>{
    passport.use(new LocalStrategy({
<<<<<<< HEAD
        usernameField: 'id',
        passwordField: 'password',
        passReqToCallback:true,//콜백함수에 req 객체를 넘길지 여부
    }, async(id, password, done)=>{
        console.log('LocalStrategy', id, password);
        try{
            const exUser = await User.findOne({where: { id } });
=======
        usernameField: 'idusers',
        passwordField: 'password',
        passReqToCallback:true,//콜백함수에 req 객체를 넘길지 여부
    }, async(req, idusers, password, done)=>{
        console.log('LocalStrategy', idusers, password);
        try{
            const exUser = await User.findOne({where: { idusers: req.body.idusers } });
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                }else{
<<<<<<< HEAD
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            }else{
                done(null, false, {message:'가입되지 않은 회원입니다.'});
=======
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            }else{
                done(null, false, { message: '가입되지 않은 회원입니다.' });
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};