const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


const User = require('../models/user');

module.exports=()=>{
    passport.use(new LocalStrategy({
        usernameField: 'idusers',
        passwordField: 'password',
        passReqToCallback:true,//콜백함수에 req 객체를 넘길지 여부
    }, async(req, idusers, password, done)=>{
        try{
            const exUser = await User.findOne({where: { idusers: req.body.idusers } });
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                }else{
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            }else{
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};