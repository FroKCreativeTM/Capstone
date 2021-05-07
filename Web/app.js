const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// HTML 경로에 대한 설정입니다.
app.get('/', (req, res) => {
    // __dirname은 현재 app.js가 있는 디렉토리입니다.
    res.sendFile(path.join(__dirname, 'HTML/index.html'));
});

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

server.listen(3000, function () {
    console.log('listening on :3000');
});