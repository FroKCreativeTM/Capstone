import cv2
import os
import numpy as np
import keras
import matplotlib.pyplot as plt
from random import shuffle
from tensorflow.keras.applications import VGG16
from tensorflow.keras import backend as KerasBackend
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.layers import Input
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import Dense, Activation , Dropout
import sys
import h5py

# 코랩을 사용한다면 사용한다.
#from google.colab import drive
#drive.mount('/content/gdrive')

in_dir = '/content/gdrive/MyDrive/Capstone/aihub'

# imagenet VGG Input에 맞게 이미지를 조정한다. 
# 이미지 정보 (224, 224, 3)
img_size = 224
img_size_2D = (img_size, img_size)
num_channels = 3

# 이미지 사이즈를 flat하게 펴준다.
img_size_flat = img_size * img_size * num_channels

# 각 이미지마다 100프레임씩 가져온다.
frame_per_file = 100

# fc2의 크기를 가져온다.
transfer_values_size = 0

def get_frames(current_dir, file_name) :
    # 파일 경로에 맞게 영상을 가져온다.
    in_file = os.path.join(current_dir, file_name)

    # 이미지를 저장할 배열을 만든다.
    images = []
    # 가져온 영상을 다룰 VideoCapture 객체를 생성한다.
    cap = cv2.VideoCapture(in_file)

    # 일단 한 프레임을 읽어들인다.
    success,image = cap.read()
    count = 0

    # 각 비디오마다 100 프래임씩 가져온다.
    while count < frame_per_file:
        # 우리가 예측기에 넣을 프레임을 생성한다.
        frame = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        res = cv2.resize(frame, dsize=(img_size, img_size),
                                 interpolation=cv2.INTER_CUBIC)
        images.append(res)
        success,image = cap.read()
        count += 1
        
    result = np.array(images)
    result = (result / 255.).astype(np.float16)
        
    return result

def label_video_names(in_dir):
    # 파일 이름을 넣는다.
    names = []
    # 이진 분류를 할 것이다.
    # 만약 폭력 상황인 경우 1,0 
    # 비폭력 상황인 경우 0,1이다.
    labels = []
    
    # 파일을 전부 가져온다.
    # 그 이후 파일에 각각 라벨링을 한다.
    for current_dir, dir_names, file_names in os.walk(in_dir):
        for file_name in file_names:
            if file_name[0:2] == 'fi':
                labels.append([1,0])
                names.append(file_name)
            elif file_name[0:2] == 'no':
                labels.append([0,1])
                names.append(file_name)
                     
    # 그 이후 이 hash들을 전부 list에 넣고
    # 섞은 뒤 이 데이터를 다시 반환한다.
    label_list = list(zip(names,labels))
    shuffle(label_list)
    names, labels = zip(*label_list)
            
    return names, labels

def proces_transfer(vid_names, in_dir, labels):
    count = 0
    tam = len(vid_names)
    
    # 형태 생성
    shape = (frame_per_file,) + img_size_2D + (3,)
    
    while count < tam:
        video_name = vid_names[count]
        
        image_batch = np.zeros(shape=shape, dtype=np.float16)
        image_batch = get_frames(in_dir, video_name)
        
        # 16비트 포인터 생성
        shape = (frame_per_file, transfer_values_size)
        transfer_values = np.zeros(shape=shape, dtype=np.float16)
        
        transfer_values = \
            image_model_transfer.predict(image_batch)
        labels1 = labels[count]
        
        aux = np.ones([100,2])
        labelss = labels1 * aux
        
        yield transfer_values, labelss
        
        count+=1

def make_files(n_files):
    
    gen = proces_transfer(names_training, in_dir, labels_training)

    numer = 1

    # Read the first chunk to get the column dtypes
    chunk = next(gen)

    row_count = chunk[0].shape[0]
    row_count2 = chunk[1].shape[0]
    
    with h5py.File('prueba.h5', 'w') as f:
    
        # Initialize a resizable dataset to hold the output
        maxshape = (None,) + chunk[0].shape[1:]
        maxshape2 = (None,) + chunk[1].shape[1:]
    
    
        dset = f.create_dataset('data', shape=chunk[0].shape, maxshape=maxshape,
                                chunks=chunk[0].shape, dtype=chunk[0].dtype)
    
        dset2 = f.create_dataset('labels', shape=chunk[1].shape, maxshape=maxshape2,
                                 chunks=chunk[1].shape, dtype=chunk[1].dtype)
    
         # Write the first chunk of rows
        dset[:] = chunk[0]
        dset2[:] = chunk[1]

        for chunk in gen:
            
            if numer == n_files:
            
                break

            # Resize the dataset to accommodate the next chunk of rows
            dset.resize(row_count + chunk[0].shape[0], axis=0)
            dset2.resize(row_count2 + chunk[1].shape[0], axis=0)

            # Write the next chunk
            dset[row_count:] = chunk[0]
            dset2[row_count:] = chunk[1]

            # Increment the row count
            row_count += chunk[0].shape[0]
            row_count2 += chunk[1].shape[0]
        
            numer += 1

def make_files_test(n_files):
    
    gen = proces_transfer(names_test, in_dir, labels_test)

    numer = 1

    # Read the first chunk to get the column dtypes
    chunk = next(gen)

    row_count = chunk[0].shape[0]
    row_count2 = chunk[1].shape[0]
    
    with h5py.File('pruebavalidation.h5', 'w') as f:
    
        # Initialize a resizable dataset to hold the output
        maxshape = (None,) + chunk[0].shape[1:]
        maxshape2 = (None,) + chunk[1].shape[1:]
    
    
        dset = f.create_dataset('data', shape=chunk[0].shape, maxshape=maxshape,
                                chunks=chunk[0].shape, dtype=chunk[0].dtype)
    
        dset2 = f.create_dataset('labels', shape=chunk[1].shape, maxshape=maxshape2,
                                 chunks=chunk[1].shape, dtype=chunk[1].dtype)
    
         # Write the first chunk of rows
        dset[:] = chunk[0]
        dset2[:] = chunk[1]

        for chunk in gen:
            
            if numer == n_files:
            
                break

            # Resize the dataset to accommodate the next chunk of rows
            dset.resize(row_count + chunk[0].shape[0], axis=0)
            dset2.resize(row_count2 + chunk[1].shape[0], axis=0)

            # Write the next chunk
            dset[row_count:] = chunk[0]
            dset2[row_count:] = chunk[1]

            # Increment the row count
            row_count += chunk[0].shape[0]
            row_count2 += chunk[1].shape[0]
        
            numer += 1

def process_alldata_training():
    
    joint_transfer=[]
    frames_num=100
    count = 0
    
    with h5py.File('prueba.h5', 'r') as f:
            
        X_batch = f['data'][:]
        y_batch = f['labels'][:]

    for i in range(int(len(X_batch)/frames_num)):
        inc = count+frames_num
        joint_transfer.append([X_batch[count:inc],y_batch[count]])
        count =inc
        
    data =[]
    target=[]
    
    for i in joint_transfer:
        data.append(i[0])
        target.append(np.array(i[1]))
        
    return data, target

def process_alldata_test():
    
    joint_transfer=[]
    frames_num=100
    count = 0
    
    with h5py.File('pruebavalidation.h5', 'r') as f:
            
        X_batch = f['data'][:]
        y_batch = f['labels'][:]

    for i in range(int(len(X_batch)/frames_num)):
        inc = count+frames_num
        joint_transfer.append([X_batch[count:inc],y_batch[count]])
        count =inc
        
    data =[]
    target=[]
    
    for i in joint_transfer:
        data.append(i[0])
        target.append(np.array(i[1]))
        
    return data, target

# VGG 모델을 불러온 뒤, 이 중 fc2 레이어를 가져온다.
vgg_model = VGG16(include_top=True, weights='imagenet')
fc2_layer = vgg_model.get_layer('fc2')
image_model_transfer = Model(inputs = vgg_model.input, outputs=fc2_layer.output)
# fc2 레이어의 크기를 가져온다. (4096)
transfer_values_size = KerasBackend.int_shape(fc2_layer.output)[1]

#First get the names and labels of the whole videos
names, labels = label_video_names(in_dir)

training_set = int(len(names)*0.8)
test_set = len(names) - training_set

names_training = names[0:training_set]
names_test = names[training_set:]

labels_training = labels[0:training_set]
labels_test = labels[training_set:]

make_files(training_set)
make_files_test(test_set)

vgg_model_json = vgg_model.to_json()
with open("vgg_model.json", "w") as json_file : 
    json_file.write(vgg_model_json)


vgg_model.save_weights("vgg_model_weight.h5")
print("Saved model to disk")

data, target = process_alldata_training()
data_test, target_test = process_alldata_test()

chunk_size = 4096
n_chunks = 100
rnn_size = 512

model = Sequential()
model.add(LSTM(rnn_size, input_shape=(n_chunks, chunk_size)))
model.add(Dropout(0.5))
model.add(Dense(512))
model.add(Activation('relu'))
model.add(Dropout(0.5))
model.add(Dense(50))
model.add(Activation('sigmoid'))
model.add(Dropout(0.5))
model.add(Dense(2))
model.add(Activation('softmax'))
model.compile(loss='binary_crossentropy', optimizer='adam',metrics=['accuracy'])

epoch = 200
batchS = 500

history = model.fit(np.array(data[0:1299]), np.array(target[0:1299]), epochs=epoch,
                    validation_data=(np.array(data[1299:]), np.array(target[1299:])), 
                    batch_size=batchS, verbose=2)

result = model.evaluate(np.array(data_test), np.array(target_test))

for name, value in zip(model.metrics_names, result):
    print(name, value)

lstm_model_json = model.to_json()
with open("lstm_model.json", "w") as json_file : 
    json_file.write(lstm_model_json)


model.save_weights("lstm_model_weight.h5")
print("Saved lstm_model to disk")