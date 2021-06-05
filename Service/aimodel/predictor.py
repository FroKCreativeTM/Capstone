# 필요한 라이브러리 불러오기
import cv2
import time
import base64
import socketio 
from datetime import datetime
import json
import time
import matplotlib.pyplot as plt
import numpy as np

from keras.models import load_model
from tensorflow.keras.models import Model, Sequential
from keras.models import model_from_json 

################################################################################################

# 모델 가져오기
vgg_json_file = open("./aimodel/aihub_model/vgg_model.json", "r")
lstm_json_file = open("./aimodel/aihub_model/lstm_model.json", "r")

vgg_loaded_model_json = vgg_json_file.read() 
vgg_json_file.close()
lstm_loaded_model_json = lstm_json_file.read() 
lstm_json_file.close()

vgg_loaded_model = model_from_json(vgg_loaded_model_json)
lstm_loaded_model = model_from_json(lstm_loaded_model_json)

vgg_loaded_model.load_weights("./aimodel/aihub_model/vgg_model_weight.h5")
lstm_loaded_model.load_weights("./aimodel/aihub_model/lstm_model_weight.h5")
print("Loaded model from disk")

vgg_loaded_model.compile(loss='binary_crossentropy', optimizer='adam',metrics=['accuracy'])
lstm_loaded_model.compile(loss='binary_crossentropy', optimizer='adam',metrics=['accuracy'])

# use the model
transfer_layer = vgg_loaded_model.get_layer('fc2')
image_model_transfer = Model(inputs=vgg_loaded_model.input, outputs=transfer_layer.output)

img_size = 224

fi_count = 0
no_count = 0
pred_image_cnt = 10
count = 0
pred_images = []

# 현재 시간을 가져온다.
now = datetime.now()
imdata = None
tick = False
filename = ''

################################################################################################

# 클라이언트 생성
sio = socketio.Client()

@sio.event
def image_data(data) :
    data = cv2.imdecode(np.frombuffer(base64.b64decode(data), dtype='uint8'), cv2.IMREAD_COLOR)
    global imdata
    imdata = data

@sio.event
def frameTickCount(data) :
    global tick
    tick = data

@sio.event
def exit(data) :
    exit()

@sio.event 
def get_filename(data) : 
    global filename
    filename = data

# loop IP : 
sio.connect('http://localhost:8001/')

while True : 
    sio.on('image_data', image_data)
    sio.on('frameTickCount', frameTickCount)
    # 5분마다 한 번씩 실행
    if tick : 
        # JSON 파일을 이용해서, 데이터를 보낸다.
        # 비디오 관련 데이터(클립X)
        json_data = {\
            'filename' : filename, \
            'start_time' : now.strftime('%Y-%m-%d-%H-%M-%S'), \
            'end_time' : datetime.now().strftime('%Y-%m-%d-%H-%M-%S'),\
            'fi_count' : fi_count, \
            'no_count' : no_count}
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

        no_count = 0
        fi_count = 0

        sio.emit('jsondata', json_data)
        now = datetime.now()
        tick = False

     # np.array로 만들기 위한 임시 공간
    res_list = []
    
    #if type(imdata) is np.ndarray :
    if isinstance(imdata, np.ndarray) :
        RGB_img = cv2.cvtColor(imdata, cv2.COLOR_BGR2RGB)
        res = cv2.resize(RGB_img, dsize=(img_size, img_size), interpolation=cv2.INTER_CUBIC)

        res_list.append(res)
        resul = np.array(res_list)
        resul = (resul / 255.).astype(np.float16)
        resul = (resul*255).astype('uint8')
        # 10장 * flatten 4096 data
        # LSTM에 넣기 위한 데이터로 변환한다.
        pred_data = image_model_transfer.predict(resul)
        
        # 이미지를 배열에 넣어준다.
        # 이 이미지가 10장이 쌓이면 LSTM으로 넘어간다.
        pred_images.append(pred_data)
        count += 1

        # 10프레임마다 lstm 훈련을 실시한다.
        if count == pred_image_cnt : 
            # 2개의 값으로 구성된 배열이 나올 것
            # 0 : fight rate
            # 1 : non fight rate
            final_data = lstm_loaded_model.predict(np.array(pred_images))
            
            total_no = 0
            total_fi = 0 
            
            for i in range(0, pred_image_cnt) : 
                total_fi += float(final_data[i][0])
                total_no += float(final_data[i][1])
            
            if((total_no) > (total_fi)) : 
                no_count += 1
                # 이 데이터는 클립 데이터입니다.
                json_data = {
                    'filename' : filename, \
                    "pred_type": 'Non-Violence', \
                    "time" : datetime.now().strftime('%Y-%m-%d-%H-%M-%S'),\
                    "Violence_percent" : (total_fi * 100) / pred_image_cnt, \
                    "Non_Violence_percent" : (total_no * 100) / pred_image_cnt ,\
                    "fi_count" : fi_count , \
                    "no_count" : no_count 
                    }
                headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}                
                sio.emit('pred_data', json_data)
                print('no')
            else : 
                fi_count += 1
                # 이 데이터는 클립 데이터입니다.
                json_data = {
                    'filename' : filename, \
                    "pred_type": 'Violence', \
                    "time" : datetime.now().strftime('%Y-%m-%d-%H-%M-%S'),\
                    "Violence_percent" : (total_fi * 100) / pred_image_cnt, \
                    "Non_Violence_percent" : (total_no * 100) / pred_image_cnt , \
                    "fi_count" : fi_count , \
                    "no_count" : no_count 
                    }
                headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}                
                sio.emit('pred_data', json_data)
                print('fi')
            
            # 리스트를 비우지 않으면, 계속 데이터가 남는다.
            pred_images = []
            final_data = np.empty(shape=(10,), dtype=np.int8)    
            count = 0
    else : 
        pass
    
    sio.on('exit', exit)

cv2.destroyAllWindows()
sio.disconnect()