const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const { sequelize } = require('./models');
const passportConfig = require('./passport');


const app = express();
passportConfig();//패스포트 설정

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'ejs');
app.set('views','./views');

sequelize.sync({ force: false })
.then(() =>{
  console.log('데이터베이스 연결 성공');
})
.catch((err) =>{
  console.error(err);
});
app.use(morgan('dev'));
 
//const server = require('http')
//const io = require('socket.io')(server);

app.use(express.static("./public"));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', pageRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) =>{
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
  res.status(err.status || 500);
  res.render('error');
})

/*
// 커넥션이 있을 때
// 즉, 클리이언트(여기서는 모델)이 연결되어 있을 때, 이 함수를 처리힙니다.
io.on('connection', function (socket) {
    socket.on('data', function (data) {
        // base64 형식을 가진 데이터를 가져옵니다.
        var frame = Buffer.from(data, 'base64').toString();
        // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
        io.emit('image', frame);
    })
});
*/

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});