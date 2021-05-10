const express = require('express');

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

module.exports = router;