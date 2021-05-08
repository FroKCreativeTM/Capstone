#!/usr/bin/env python
# coding: utf-8

# In[10]:

# 필요한 라이브러리 불러오기
import cv2
import time
import base64
import socketio
import datetime
import json
import time

# In[11]:

# 영상 정보 생성
fps = 30        # 프레임
width = 640     # 가로
height = 480    # 세로


# In[12]:

# 비디오 플레이에 대한 함수
# 여기에 이제 매개변수로, 
def video_play() : 
    # 기본 컨트롤 변수들
    tickCount = 0
    # 현재 시간을 가져온다.
    now = datetime.datetime.now()
    
    # 비디오를 현재 장치로 불러오고, 이 비디오에 대한 설정을 한다.
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

    # 파일과 코덱 설정한 뒤 비디오라이터를 생성해서, 나갈 파일을 생성한다.
    fourcc = cv2.VideoWriter_fourcc(*'DIVX')
    filename = now.strftime("%Y") + "_" +     now.strftime("%m") + "_" + now.strftime("%d") + "_" + now.strftime("%H") +     "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
    out = cv2.VideoWriter(filename, fourcc, fps, (int(width), int(height)))

    # 인코드 파라미터를 설정한다.
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

    # 비디오 실행
    while True:
        # 30프레임이니 한 번씩 재운다.
        time.sleep(1 / fps)

        # 만약 1분이 지난다면, 비디오를 따로 빼기 위해서, 다시 설정한다.
        if(tickCount > 1800) : 
            tickCount = 0

            # JSON 파일을 이용해서, 데이터를 보낸다.
            json_data = {'filename': filename, "start-time" : now.strftime('%Y-%m-%d-%H-%M-%S'), "end-time" : datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}
            headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

            print("sand json file")
            sio.emit('jsondata', json_data)

            #저장 파일 종료
            out.release()

            now = datetime.datetime.now()
            filename = now.strftime("%Y") + "_" + now.strftime("%m") + "_" + now.strftime("%d") + "_" + now.strftime("%H") + "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
            out = cv2.VideoWriter(filename, fourcc, fps, (int(width), int(height)))

        # 프레임과 이와 관련된 정보를 리턴 받는다.
        ret, frame = cap.read()
        # 테스트 코드
        # opencv 창을 만들어서 이를 
        cv2.imshow('CCTV', frame)
        # 현재 프레임을 영상에 쓴다.
        out.write(frame)

        # 미리 설정된 인코드에 따라서 현재 화면을 jpg로 변환한다.
        result, frame = cv2.imencode('.jpg', frame, encode_param)
        # base64 타입으로 변환한다.
        b64data = base64.b64encode(frame)
        # 이 데이터를 data 태그를 붙이고, 소켓으로 NodeJS 서버에 보낸다.
        sio.emit('data', b64data)

        # tickCount 1 증가
        tickCount += 1

        # 만약 어떤 키가 들어온다면
        if cv2.waitKey(1) > 0: 
            # 녹화 중지
            out.release()
            # 모든 창 소멸
            cv2.destroyAllWindows()
            break


# In[13]:


# 메인 함수
if __name__ == "__main__" : 
    # 클라이언트 생성
    sio = socketio.Client()
    # loop IP : 
    sio.connect('http://127.0.0.1:3000')
    # 비디오를 플레이한다.
    video_play()
    # 통신 종료
    sio.disconnect()

