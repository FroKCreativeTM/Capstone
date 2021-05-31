import cv2
import time
import base64
import socketio
from datetime import datetime
import json
import time
import matplotlib.pyplot as plt
import numpy as np

#fps = cap.get(cv2.CAP_PROP_FPS) # 카메라에 따라 값이 정상적, 비정상적
fps = 30.0        # 프레임
width = 640     # 가로
height = 480    # 세로

def video_play() :
    # 현재 시간을 가져온다.
    now = datetime.now()
    
    # 1프레임과 다음 프레임 사이의 간격 설정
    delay = round(1000/fps)
    frameCounter = 0
    
    # 비디오를 현재 장치로 불러오고, 이 비디오에 대한 설정을 한다.
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    cap.set(cv2.CAP_PROP_FPS, fps)

    # 파일과 코덱 설정한 뒤 비디오라이터를 생성해서, 나갈 파일을 생성한다.
    fourcc = cv2.VideoWriter_fourcc(*'DIVX')
    #filename = "./aimodel/movie/" + now.strftime("%Y") + "_" +     now.strftime("%m") + "_" + now.strftime("%d") + "_" + now.strftime("%H") + "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
    filename = "./aimodel/movie/" + now.strftime("%Y") +\
         "_" + now.strftime("%m") + "_" + now.strftime("%d") + "_" \
             + now.strftime("%H") + "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
    out = cv2.VideoWriter(filename, fourcc, cap.get(cv2.CAP_PROP_FPS), (int(width), int(height)))

    # 인코드 파라미터를 설정한다.
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

     # 비디오 실행
    while (cap.isOpened()) :
        if((datetime.now() - now).seconds >= 60) : 
        #if frameCounter == 1800 : 
            sio.emit('frameTickCount', {'tick' : True})
            #저장 파일 종료
            out.release()
            now = datetime.now()
            #frameCounter = 0

            filename = "./aimodel/movie/" + now.strftime("%Y") +\
                "_" + now.strftime("%m") + "_" + now.strftime("%d") + "_" \
                + now.strftime("%H") + "_" + now.strftime("%M") + "_" + now.strftime("%S") + ".avi"
            out = cv2.VideoWriter(filename, fourcc, cap.get(cv2.CAP_PROP_FPS), (int(width), int(height)))

        if cv2.waitKey(int(1000 / fps)) == 27:         # wait for ESC key to exit
            sio.emit('exit', {'exit' : 'exit'})
            # 녹화 중지
            out.release()
            cap.release()
            # 모든 창 소멸
            #cv2.destroyAllWindows()
            break

        # 프레임과 이와 관련된 정보를 리턴 받는다.
        ret, frame = cap.read()

        if ret == True : 
            cv2.putText(frame, text=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), \
                org=(30, 450), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(0,255,0), thickness=2)
            out.write(frame)
            
            #frameCounter += 1
            # 테스트 코드
            # opencv 창을 만들어서 이를 별도의 창에 출력
            #cv2.imshow('CCTV', frame)    

            # 미리 설정된 인코드에 따라서 현재 화면을 jpg로 변환한다.
            result, frame = cv2.imencode('.jpg', frame, encode_param)
            # base64 타입으로 변환한다.
            b64data = base64.b64encode(frame)
            # 이 데이터를 data 태그를 붙이고, 소켓으로 NodeJS 서버에 보낸다.
            sio.emit('image_data', b64data)

# 메인 함수
if __name__ == "__main__" : 
    # 클라이언트 생성
    sio = socketio.Client()
    # loop IP : 
    sio.connect('http://localhost:8001/')
    # 비디오를 플레이한다.
    video_play()
    # 통신 종료
    sio.disconnect()