"# Capstone" 

# 캡스톤 디자인
전남대학교 캡스톤 디자인 프로젝트를 관리하기 위한 레포지토리입니다.<br/>

### 공지사항
#### 필독
이거 안하면 비밀번호 암호화 안되서 오류뜸</br> 
경로는 사람마다 경로는 다를 수 있음</br>
1. cmd 실행
2. cd C:\Program Files\MySQL\MySQL Server 8.0\bin 치고 엔터
3. mysql 치고 엔터
4. 비밀번호 치고 mysql 로그인
5. SET @@global.sql_mode= 'NO_ENGINE_SUBSTITUTION';

### 변경사항
##### 2021-05-07
프로젝트 생성 및 기초적인 설정 진행(19:23) <br/>
미들웨어 설치 <br/>
단 아직 socketio에 대한 처리가 안 되어 있어서 이 점 좀 고쳐야할 듯(주석처리 하겠음) - @Cha<br/>

##### 2021-05-08
CCTV 코드 .py로 빼둠 - @Cha<br/>

#### 2021-05-09

html 파일을 ejs로 포팅 완료<br/>
passport 설치 <br/>
nunjucks 사용하려다가 폐지(ejs랑 겹침)<br/>
CCTV 스트리밍 되는지 확인해야됨<br/>
로그인 되는지도 확인해야됨<br/>
sequelizer(db) 설치(안쓸거면 조금 바꿔야할듯(web\models폴더에 있는 것들))<br/>
라우터 설정 완료<br/>
css 적용 완료 - @Lee<br/>
----------------------------------- <br/>
ejs에 영상 데이터 보내는 작업 완료. <br/>
파이썬 코드에 모델 링크 작업 - @Cha<br/>
-----------------------------------

#### 2021-05-10
디자인 수정<br/>
로그인 관련 수정</br>
에러메시지 출력 수정</br>
admin페이지 안들어가지던거 수정</br>
<<<<<<< HEAD
CCTV 변경한거 적용 - @Lee<br/>
=======
CCTV 변경한거 적용 - @Lee<br/>
cctv 이미지 출처(https://unsplash.com/photos/oQD9uq4Rd4I)
cctv svg 이미지 출처(https://www.svgrepo.com/svg/8270/cctv)


#### 2021-05-16
DB추가<br>
-@CHOI
-----------------------------------------------
localStrategy.js 수정</br>
패스워드 암호화</br>
아이디, 비밀번호 일치해도 로그인은 안됨 수정해야함</br>
register 라우터 수정(@Choi와 공동작업) -@lee</br>
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
