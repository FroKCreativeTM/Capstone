const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

let authData = {
    id: 'root',
    password: 'root',
    name: 'lee'
};

router.post('/register', isNotLoggedIn, async(req, res, next) =>{
    const password = req.body;
    try{
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            password:hash,
        });
        return res.redirect('/');
    }catch(error){
        console.error(error);
        return next(error);
    }
});
//여기까지 회원가입 라우터

router.post('/login', isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local', (authError, user, info) =>{
        if(authError){
            console.log(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/admin');
        });
    })(req, res, next);//미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
})
//로그인 라우터

router.get('/logout', isLoggedIn, (req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
//로그아웃 라우터

module.exports = router;