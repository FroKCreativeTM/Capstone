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

router.get('/register ', isNotLoggedIn, (req, res) =>{
    res.render('register', {title: '회원가입 - capstoneweb'});
});

module.exports = router;