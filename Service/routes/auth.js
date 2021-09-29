const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const fs = require('fs');
const mysql=require("mysql2");

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'capstone',
    port:'3306'
  });

const router = express.Router();

router.post('/register', isNotLoggedIn, async(req, res, next) =>{
    const  password = req.body.inputPassword;
    try{
        const exUser = await User.findOne({where: { tele: req.body.inputTele } });
        if(exUser){
            return res.redirect('/register?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
        password:hash,
        name: req.body.inputName,
        Dept: req.body.inputDept,
        ranking: req.body.inputRank,
        tele: req.body.inputTele,
        // birth: req.body.inputBirth,
        addr: req.body.inputAddr,
      });
      return res.redirect('/');
    } catch (err) {
      console.error(err);
      next(err);
    }
});
//회원가입 라우터

router.get('/login', function(req, res, next) {
    res.render("/auth/login");
});
router.post('/login', isNotLoggedIn, (req, res, next)=>{
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
            if(req.body.Dept===1){
                return res.redirect('/umain');  
            }else{
                return res.redirect('/admin'); 
            }
        });
    })(req, res, next);//미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
})

router.post('/logout', isLoggedIn, (req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
//로그아웃 라우터


/*
router.post('/adminProfile',isLoggedIn,function(req,res,next){
    var idusers=req.user.idusers;
    console.log(idusers);
    var password=req.body.password;
    var Dept=req.body.Dept;
    var rank=req.body.rank;
    var tele=req.body.tele;
    connection.query('UPDATE users SET , Dept=?, rank=?, tele=? WHERE idusers=?',
    [ Dept, rank, tele, idusers],function(err,rows,fields){
        if(err){
            console.log(err);
        }
    });
    res.render("/adminProfile");
});*/

router.post('/DelUser',isNotLoggedIn,function(req,res,next){
    var deluser=req.body.idusers;
    console.log(deluser);
    connection.query('DELETE FROM users WHERE idusers=?',[deluser], function(err, result){
        if(err){
            console.error(err);
            throw err;
        } else {
            res.render('DelUser');                
        }
    });
});


//회원 정보 수정

module.exports = router;