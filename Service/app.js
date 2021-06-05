const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');
const { sequelize } = require('./models');
const exec = require('child_process').execFile;
const { use } = require('./routes/page');

const video = require('./models/video');
const crime = require('./models/crime');

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

// 비디오 경로 주소를 받을 변수입니다.
let location = '';

// 커넥션이 있을 때
// 즉, 클리이언트(여기서는 모델)이 연결되어 있을 때, 이 함수를 처리힙니다.
io.on('connection', function (socket) {
  socket.join("videos");
  socket.on('image_data', function (data) {
      // base64 형식을 가진 데이터를 가져옵니다.
      var frame = Buffer.from(data, 'base64').toString();
      // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
      io.emit('image', frame);
      io.sockets.in("videos").emit('image_data', data);
  });
  socket.on('jsondata', function (data) {
      // {
      //   'start-time': '2021-06-02-15-35-04',
      //   'end-time': '2021-06-02-15-35-50',
      //   fi_count: 0,
      //   no_count: 6
      // }
      // 이 callback 함수에서는 다음처럼 비디오에 대한 정보를 가져옵니다.
      // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
      io.emit('jsonData', data);
      console.log(data);
      async function change_video(){
        await video.update({
          starttime : data.start_time,
          endtime : data.end_time,
          fi_count : data.fi_count,
          non_count : data.no_count,
          videodate : data.start_time
        }
          ,{where: {locations : location}});
      }
      change_video();
      /*async function put_video(){
        await crime.create({
          idvideo : '',
          locations : location,
          starttime : '0',
          endtime : '0',
          fi_count : '0',
          non_count : '0',
          videodate : '0',
          videoplace : "home"
        });
      }
      put_video();*/
  });
  socket.on('frameTickCount', function (data) {
      // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
      io.emit('frameTickCount', data.tick);
      console.log('tick : ' + data.tick);
  });
  socket.on('get_filename', function (data) {
      // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
      location = data;
      io.emit('get_filename', data);
      console.log('get_filename : ' + location);
      async function put_video(){
        await video.create({
          idvideo : '',
          locations : location,
          fi_count : '0',
          non_count : '0',
          videoplace : "home"
        });
      }
      put_video();

  });
  socket.on('pred_data', function (data) {
      // {
      //   pred_type: 'Non-Violence',
      //   time: '2021-06-02-15-38-36',
      //   Violence_percent: 0.1359804265666753,
      //   Non_Violence_percent: 99.86401796340942
      // }
      // 이 callback 함수에서는 이러한 json 데이터를 받습니다.
      // 이 받은 데이터를 image라는 태그를 가진 데이터로써 웹 페이지에 뿌립니다.
      const viol_pred = parseFloat(data.Violence_percent).toFixed(3);
      const non_viol_pred = parseFloat(data.Non_Violence_percent).toFixed(3);
    
      io.emit('viol_pred', viol_pred);
      io.emit('non_viol_pred', non_viol_pred);
  
      console.log(data);
      async function put_crime(){
        await crime.create({
          idcrime : '',
          locations : location,
          pred_type : data.pred_type,
          fi_percent : viol_pred,
          non_percent : non_viol_pred,
        });
      }
      put_crime();

      async function change_video(){
        await video.update({
          endtime : data.time,
          fi_count : data.fi_count,
          non_count : data.no_count,
        }
          ,{where: {locations : location}});
      }
      change_video();
  });
});

server.listen(app.get('port'), () => {
    // batch 파일
    exec('CCTV.bat', function(err, data) {  
       console.log(err);
       console.log(data.toString());                       
     });  
    exec('prediction.bat', function(err, data) {  
       console.log(err);
       console.log(data.toString());                       
     });  

    console.log(app.get('port'), '번 포트에서 대기 중');
});