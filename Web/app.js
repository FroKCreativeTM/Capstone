const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

// 미들웨어
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
app.set('port', process.env.PORT || 3000);

/*
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));
*/

// HTML 경로에 대한 설정입니다.
// 라우터로 고칠 예정
app.get('/', (req, res) => {
    // __dirname은 현재 app.js가 있는 디렉토리입니다.
    res.sendFile(path.join(__dirname, 'HTML/CCTV.html'));
});

// 커넥션이 있을 때
// 즉, 클리이언트(여기서는 모델)이 연결되어 있을 때, 이 함수를 처리힙니다.
io.on('connection', function (socket) {
    socket.on('data', function (data) {
        // base64 형식을 가진 데이터를 가져옵니다.
        var frame = Buffer.from(data, 'base64').toString();
        // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
        io.emit('image', frame);
    });

    socket.on('jsondata', function (jsondata) {
        console.log(jsondata);
        io.emit('jsondata', jsondata);
    });
});


server.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});