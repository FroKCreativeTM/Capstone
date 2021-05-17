const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/register', isNotLoggedIn, async(req, res, next) =>{
    const  password = req.body.inputPassword;
    
    //const password = req.body.inputPassword;
    try{
        const exUser = await User.findOne({where: { tele: req.body.inputTele } });
        if(exUser){
            return res.redirect('/register?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
        password:hash,
        //password: req.body.inputPassword,
        name: req.body.inputName,
        usertype: req.body.inputUserType,
        Dept: req.body.inputDept,
        rank: req.body.inputRank,
        tele: req.body.inputTele,
        birth: req.body.inputBirth,
        addr: req.body.inputAddr,
      });
      //console.log(user);
      //res.status(201).json(user);
      return res.redirect('/admin');
    } catch (err) {
      console.error(err);
      next(err);
    }
});
//여기까지 회원가입 라우터 인데 이거 회원가입 만들었으니까 삭제해도 되려나?

router.post('/login', isNotLoggedIn, (req, res, next)=>{
   // return res.redirect('/admin'); //이거 왜 리턴 되어있지?
    passport.authenticate('local', (authError, user, info) =>{
        if(authError){
            console.error(authError);
            return next(authError);
        }//실패
        if(!user){
            console.log("아이디 비밀번호 불일치");
            return res.redirect('/');
        }//성공 => req객체에 login과 logout 메서드 추가
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
                if(req.body.inputRank===0){
                    return res.redirect('/admin');
                }else{
                    return res.redirect('/umain');
                }
        });
    })(req, res, next);//미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
})
//로그인 라우터

router.post('/logout', isLoggedIn, (req,res)=>{
    //return res.redirect('/login');
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});
//로그아웃 라우터

module.exports = router;