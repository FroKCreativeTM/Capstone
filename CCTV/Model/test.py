import cv2

from keras.models import model_from_json 

vgg_json_file = open("vgg_model.json", "r")
lstm_json_file = open("lstm_model.json", "r")

vgg_loaded_model_json = vgg_json_file.read() 
vgg_json_file.close()
lstm_loaded_model_json = lstm_json_file.read() 
lstm_json_file.close()

vgg_loaded_model = model_from_json(vgg_loaded_model_json)
lstm_loaded_model = model_from_json(lstm_loaded_model_json)

vgg_loaded_model.load_weights("vgg_model_weight.h5")
lstm_loaded_model.load_weights("lstm_model_weight.h5")
print("Loaded model from disk")

vgg_loaded_model.compile(loss="binary_crossentropy", optimizer="rmsprop", metrics=['accuracy'])
lstm_loaded_model.compile(loss="binary_crossentropy", optimizer="rmsprop", metrics=['accuracy'])
# score = loaded_model.evaluate(X,Y,verbose=0)

# 영상 정보 생성
fps = 30        # 프레임
width = 640     # 가로
height = 480    # 세로

# 비디오 플레이에 대한 함수
# 여기에 이제 매개변수로, 
def video_play() : 
    # 기본 컨트롤 변수들
    tickCount = 0
    # 현재 시간을 가져온다.
    now = datetime.datetime.now()
    
    # 비디오를 현재 장치로 불러오고, 이 비디오에 대한 설정을 한다.
    cap = cv2.VideoCapture('0Ow4cotKOuw_1.avi')
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

        # 프레임과 이와 관련된 정보를 리턴 받는다.
        ret, frame = cap.read()
        # 테스트 코드
        # opencv 창을 만들어서 이를 
        cv2.imshow('CCTV', frame)
        # 현재 프레임을 영상에 쓴다.
        out.write(frame)

        # 미리 설정된 인코드에 따라서 현재 화면을 jpg로 변환한다.
        result, frame = cv2.imencode('.jpg', frame, encode_param)

        # tickCount 1 증가
        tickCount += 1

        # 만약 어떤 키가 들어온다면
        if cv2.waitKey(1) > 0: 
            # 녹화 중지
            out.release()
            # 모든 창 소멸
            cv2.destroyAllWindows()
            break

# 메인 함수
if __name__ == "__main__" : 
    # 비디오를 플레이한다.
    video_play()