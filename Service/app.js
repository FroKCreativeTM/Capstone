const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

<<<<<<< HEAD
=======

>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');
<<<<<<< HEAD
=======
const { sequelize } = require('./models');
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
const exec = require('child_process').execFile;
const { use } = require('./routes/page');

const app = express();
passportConfig();//패스포트 설정

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'ejs');
app.set('views','./views');

<<<<<<< HEAD
=======

sequelize.sync({ force: false })
.then(() =>{
  console.log('데이터베이스 연결 성공');
})
.catch((err) =>{
  console.error(err);
});


>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
app.use(morgan('dev'));
 
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
app.use('/auth', authRouter);

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

const server = require('http').Server(app);
const io = require('socket.io')(server);

// 커넥션이 있을 때
// 즉, 클리이언트(여기서는 모델)이 연결되어 있을 때, 이 함수를 처리힙니다.
io.on('connection', function (socket) {
    socket.on('image_data', function (data) {
        // base64 형식을 가진 데이터를 가져옵니다.
        var frame = Buffer.from(data, 'base64').toString();
        // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
        io.emit('image', frame);
    });
    socket.on('jsondata', function (data) {
      // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
      io.emit('jsonData', data);
      console.log(data);
  });
  socket.on('pred_data', function (data) {
    // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
    const viol_pred = parseFloat(data.Violence_percent).toFixed(3);
    const non_viol_pred = parseFloat(data.Non_Violence_percent).toFixed(3);

    io.emit('viol_pred', viol_pred);
    io.emit('non_viol_pred', non_viol_pred);

    console.log(data);
  });
});

server.listen(app.get('port'), () => {
    // batch 파일
<<<<<<< HEAD
    exec('CCTV.bat', function(err, data) {  
      console.log(err)
      console.log(data.toString());                       
    });  
=======
    /*exec('CCTV.bat', function(err, data) {  
      console.log(err)
      console.log(data.toString());                       
    });*/  
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846

    console.log(app.get('port'), '번 포트에서 대기 중');
});