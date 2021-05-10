const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/register', isNotLoggedIn, async(req, res, next) =>{
    const password = req.body;
    try{
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            password:hash,
        });
        return res.redirect('/admin');
    }catch(error){
        console.error(error);
        return next(error);
    }
});
//여기까지 회원가입 라우터

router.post('/login', isNotLoggedIn, (req, res, next)=>{
    return res.redirect('/admin');
    passport.authenticate('local', (authError, user, info) =>{
        if(authError){
            console.log(req.id, req.password);
            console.log(authError);
            return next(authError);
        }//실패
        if(!user){
            console.log(req.id, req.password);
            return res.redirect('/login');
        }//성공 => req객체에 login과 logout 메서드 추가
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

router.post('/logout', isLoggedIn, (req,res)=>{
    return res.redirect('/login');
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});
//로그아웃 라우터

module.exports = router;