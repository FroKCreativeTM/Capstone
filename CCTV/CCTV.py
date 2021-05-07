#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import cv2
import time
import base64
import socketio

sio = socketio.Client()
# loop IP : 
sio.connect('http://127.0.0.1:3000')

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

while True:
    time.sleep(1 / 30)
    ret, frame = cap.read()
    cv2.imshow('CCTV', frame)
    result, frame = cv2.imencode('.jpg', frame, encode_param)
    b64data = base64.b64encode(frame)
    sio.emit('data', b64data)
    if cv2.waitKey(1) > 0: break
sio.disconnect()

