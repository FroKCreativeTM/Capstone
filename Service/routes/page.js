const express = require('express');
const {isLoggedIn,isNotLoggedIn}=require('./middlewares');
const mysql=require("mysql2");
const User = require('../models/user');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'keAarwrm76*',
    database : 'capstone',
    port:'3306'
  });

const router = express.Router();
router.use((req, res, next)=>{
    res.locals.user=req.user;
    next();
});

router.get('/userProfile',isLoggedIn,(req,res)=>{
    console.log(req.user.idusers);
    const id=req.user.idusers;
    console.log(id);
    connection.query('SELECT * FROM users WHERE idusers=?',[id], function(err, result) {
        if(err){
            console.error(err);
            throw err;
        } else {
            res.render('userProfile', {bring: result});                
        }
    });
});

router.post('/userProfile',isLoggedIn,function(req,res,next){
    var iduser=req.user.idusers;
    var addr=req.user.addr;
    var tele=req.body.tele;
    
    connection.query('UPDATE users SET tele=? WHERE idusers=?',
    [ tele, iduser ],function(err,result){
        if(err){
            console.log(err);
        }
    });
    connection.query('UPDATE users SET addr=? WHERE idusers=?',
    [ addr, iduser ],function(err,result){
        if(err){
            console.log(err);
        }
    });
    res.render('umain');
});

//

router.get('/adminProfile',isLoggedIn,(req,res)=>{
    console.log(req.user.idusers);
    const id=req.user.idusers;
    console.log(id);
    connection.query('SELECT * FROM users WHERE idusers=?',[id], function(err, result) {
        if(err){
            console.error(err);
            throw err;
        } else {
            res.render('adminProfile', {bring: result});                
        }
    });
});
router.post('/adminProfile',isLoggedIn,function(req,res,next){
    var iduser=req.user.idusers;
    var Dept=req.body.Dept;
    var ranking=req.body.ranking;
    var tele=req.body.tele;
    connection.query('UPDATE users SET tele=? WHERE idusers=?',
    [ tele, iduser ],function(err,result){
        if(err){
            console.log(err);
        }
    });
    connection.query('UPDATE users SET ranking=? WHERE idusers=?',
    [ ranking, iduser ],function(err,result){
        if(err){
            console.log(err);
        }
    });
    connection.query('UPDATE users SET Dept=? WHERE idusers=?',
    [ Dept, iduser ],function(err,result){
        if(err){
            console.log(err);
        }
    });
    res.render('admin');
});

router.get('/register', isNotLoggedIn,  (req, res) =>{
    res.render('register');
});

router.get('/', isNotLoggedIn,(req,res,next)=>{
    res.render('login');
});

router.get('/umain', isLoggedIn, (req,res)=>{
    res.render('umain');
});

router.get('/admin', isLoggedIn, (req,res)=>{
    res.render('admin');
});


router.get('/DelUser',isNotLoggedIn,(req,res)=>{
    connection.query('SELECT * FROM users', function(err, result) {
        if(err){
            console.error(err);
            throw err;
        } else {
            res.render('DelUser', {users: result});                
        }
    });
});
router.post('/DelUser',isNotLoggedIn,(req,res,next)=>{
    var id=req.body.id;
    console.log(id);
    connection.query('DELETE FROM users WHERE idusers=?',[id], function(err, result) {
        if(err){
            console.error(err);
            throw err;
        } else {
            res.render('admin');                 
        }
    });
});

router.get('/video_past',isLoggedIn,(req,res)=>{
    connection.query('SELECT * FROM video', function(err, result) {
        if(err){
            console.error(err);
            throw err;
        } else {
            res.render('video_past', {video: result});                
        }
    });
});

router.get('/video_crime',isLoggedIn,(req,res)=>{
    connection.query('SELECT * FROM crime', function(err, result) {
        if(err){
            console.error(err);
            throw err;
        } else {
            res.render('video_crime', {crime: result});                
        }
    });
});

router.get('/liveStream',isLoggedIn, (req,res)=>{
    res.render('liveStream');
});


module.exports = router;