const express = require('express');
<<<<<<< HEAD

const router = express.Router();
router.use((req, res, next)=>{
    res.locals.ueser=req.user;
    next();
});

router.get('/userProfile',(req, res)=>{
    res.render('userProfile');
});
router.get('/adminProfile',(req, res)=>{
    res.render('adminProfile');
});
router.get('/register', (req, res) =>{
    res.render('register');
});

router.get('/', (req,res,next)=>{
    res.render('login');
});

router.get('/admin', (req,res)=>{
    res.render('admin');
});

router.get('/umain', (req,res)=>{
    res.render('umain');
});

router.get('/DelUser',(req,res)=>{
    res.render('DelUser');
});

router.get('/liveStream', (req,res)=>{
    res.render('liveStream');
});

=======
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


>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
module.exports = router;