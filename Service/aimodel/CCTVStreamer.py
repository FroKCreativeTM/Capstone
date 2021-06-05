import cv2
import time
import base64
import socketio
from datetime import datetime
import json
import time
import matplotlib.pyplot as plt
import numpy as np
import os

#fps = cap.get(cv2.CAP_PROP_FPS) # 카메라에 따라 값이 정상적, 비정상적
fps = 30.0        # 프레임
avg_no = 0
avg_fi = 0

def video_play() :
    sio.on('viol_pred', viol_pred)
    sio.on('non_viol_pred', non_viol_pred)
    # 현재 시간을 가져온다.
    now = datetime.now()
    
    # 비디오를 현재 장치로 불러오고, 이 비디오에 대한 설정을 한다.
    cap = cv2.VideoCapture('C:/Users/user/OneDrive - Chonnam National University/CSE/CapstoneDesign/movie/test/01.mp4')
    vid_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    vid_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')

    # 파일과 코덱 설정한 뒤 비디오라이터를 생성해서, 나갈 파일을 생성한다.
    #filename = "./aimodel/movie/" + now.strftime("%Y") + "_" +     now.strftime("%m") + "_" + now.strftime("%d") + "_" + now.strftime("%H") + "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
    filename = os.getcwd() + "/aimodel/movie/" + now.strftime("%Y") +\
         "_" + now.strftime("%m") + "_" + now.strftime("%d") + "_" \
             + now.strftime("%H") + "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
    sio.emit('get_filename', filename)

    # 녹화 영상에 대한 세팅
    out = cv2.VideoWriter(filename, fourcc, cap.get(cv2.CAP_PROP_FPS), (vid_width, vid_height))

    # 인코드 파라미터를 설정한다.
    # 지금 이미지의 90%로 압축
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

     # 비디오 실행
    while (cap.isOpened()) :
        # 만약 5분이 지나면
        if((datetime.now() - now).seconds >= 300) :  
            sio.emit('frameTickCount', {'tick' : True})
            #저장 파일 종료
            out.release()
            now = datetime.now()
            #frameCounter = 0

            filename = os.getcwd() + "/aimodel/movie/" + now.strftime("%Y") +\
                "_" + now.strftime("%m") + "_" + now.strftime("%d") + "_" \
                + now.strftime("%H") + "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
            sio.emit('get_filename', filename)
            out = cv2.VideoWriter(filename, fourcc, cap.get(cv2.CAP_PROP_FPS), (vid_width, vid_height))

        # 프레임과 이와 관련된 정보를 리턴 받는다.
        ret, frame = cap.read()

        if ret == True : 
            cv2.putText(frame, text=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), \
                org=(30, 400), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(0,255,0), thickness=2)
            out.write(frame)
            
            # 미리 설정된 인코드에 따라서 현재 화면을 jpg로 변환한다.
            result, frame = cv2.imencode('.jpg', frame, encode_param)
            # base64 타입으로 변환한다.
            b64data = base64.b64encode(frame)
            # 이 데이터를 data 태그를 붙이고, 소켓으로 NodeJS 서버에 보낸다.
            sio.emit('image_data', b64data)

        if cv2.waitKey() == 27:         # wait for ESC key to exit
            sio.emit('exit', {'exit' : 'exit'})
            # 녹화 중지
            out.release()
            cap.release()
            # 모든 창 소멸
            #cv2.destroyAllWindows()
            break

# 메인 함수
if __name__ == "__main__" : 
    # 클라이언트 생성
    # 첫번째 : 이미지 데이터를 서버로 저장하는 기능
    # 두번째 : 폭력/비폭력 확률을 받아서 저장하는 역할
    sio = socketio.Client()

    # loop IP : 
    sio.connect('http://localhost:8001/')

    @sio.event
    def viol_pred(data) :
        global avg_fi
        avg_fi = data
        
    @sio.event
    def non_viol_pred(data) :
        global avg_no
        avg_no = data

    # 비디오를 플레이한다.
    video_play()
    # 통신 종료
    sio.disconnect()