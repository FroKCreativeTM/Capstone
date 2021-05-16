const express = require('express');
const {isLoggedIn,isNotLoggedIn}=require('./middlewares');


const router = express.Router();
router.use((req, res, next)=>{
    res.locals.user=req.user;
    next();
});

router.get('/userProfile',isLoggedIn,(req, res)=>{
    res.render('userProfile');
});
router.get('/adminProfile',isLoggedIn,(req, res)=>{
    res.render('adminProfile');
});
router.get('/register', isNotLoggedIn, (req, res) =>{
    res.render('register');
});

router.get('/', isNotLoggedIn,(req,res,next)=>{
    res.render('login');
});

router.get('/admin', isNotLoggedIn, (req,res)=>{
    res.render('admin');
});

router.get('/umain', isLoggedIn, (req,res)=>{
    res.render('umain');
});

router.get('/DelUser',isLoggedIn,(req,res)=>{
    res.render('DelUser');
});

router.get('/liveStream',isLoggedIn, (req,res)=>{
    res.render('liveStream');
});


module.exports = router;