const express = require('express');

const{isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();
router.use((req, res, next)=>{
    res.locals.ueser=req.user;
    next();
});

router.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile', { title: '내 정보 - capstoneweb'});
});

router.get('/enroll', isLoggedIn, (req, res) =>{
    res.render('enroll', {title: '회원가입 - capstoneweb'});
});

router.get('/', isNotLoggedIn, (req,res,next)=>{
    res.render('login', {title:'로그인'});
});

router.get('/admin', isLoggedIn, (req,res)=>{
    res.render('admin', {title:'관리자 페이지'});
});

router.get('/umain', isLoggedIn, (req,res)=>{
    res.render('umain', {title:'사용자 페이지'});
});

router.get('/DelUser', isLoggedIn, (req,res)=>{
    res.render('DelUser', {title:'사용자 삭제'});
});

// router.get('/liveStream', isLoggedIn, (req,res)=>{
router.get('/liveStream', (req,res)=>{  // 테스트 코드이므로, 나중에 수정 예정
    res.render('liveStream', {title:'CCTV Live Stream'});
});

module.exports = router;