import cv2
import time
import base64
import socketio

# socketIO를 이용해서 클라이언트 하나를 생성한다.
sio = socketio.Client()
# loop IP : 
sio.connect('http://127.0.0.1:3000')

# 카메라는 현재 컴퓨터에 연결되어있는 1번 카메라를 가져온다.
cap = cv2.VideoCapture(0)
# 640 x 480 의 화질로 송출받는다.
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# 인코딩 퀄리티를 설정한다.
encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

while True:
    # 30분의 1초당 한 번씩 작동하게 한다.(30fps)
    time.sleep(1 / 30)

    # 화면을 받는다.
    ret, frame = cap.read()

    # 다른 화면으로 출력한다.(임시)
    cv2.imshow('CCTV', frame)

    # jpg로 변환한다.
    result, frame = cv2.imencode('.jpg', frame, encode_param)

    # base64를 이용해서 인코딩한다.
    b64data = base64.b64encode(frame)

    # data라는 태그를 주고, 서버로 보낸다.
    sio.emit('data', b64data)

    # 어떤 키가 눌릴 때까지 반복한다.
    if cv2.waitKey(1) > 0: 
        cap.release()
        cv2.destroyAllWindows()
        break

# 위의 while true를 벗어나면, 서버와의 연결을 끊는다.
sio.disconnect()

