var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    console.log(queryData.id);
    if(_url == '/'){
      title='LogIn';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${title}`, 'utf8', function(err,descrption){
      var template=`
      <!DOCTYPE html>
      <html>
        <head>
            <meta charset="utf-8" />
        <title>${title}</title>
        <style>
        :root {
            --color-beige:#f6f5ee;
            --color-font-black: #333;
            --color-font-light-black: #555;
            --color-font-green: #669900;
            --temp-border :solid 0px black;
            --font-family : normal Avenir, Arial, georgia;
        }
        
        * {
            margin: 0;
          
            padding: 0;
            color:var(--color-font-black);
            font-family: var(--font-family);
        }
        header{
            border-top: solid 2px black;
            background: var(--color-beige);
            position: fixed;
            top:0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        
        }
        header .head-wrap{
        
            border:var( --temp-border);
            height: 120px;
            width: 1100px;
           
        }
        
        header .head-wrap .head-wrap-inner{
            height: 120px;
            width: 1100px;
            position: relative;
            border:var( --temp-border);
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav{
            position: absolute;
            left:552px;
            top:21px;
  
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav ul{
            list-style: none;
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav ul li{
            float: left;
            color: var( --color-font-light-black);
            font-size: 13px;
            text-align: center;
            height: 20px;
          
            border:var( --temp-border);
        
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav ul li a{
            text-decoration: none;
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav ul li a:hover{
            text-decoration: underline;
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav ul .top-nav01
        {
            width:76px;
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav ul .top-nav02
        {
            width:106px;
        }
        header .head-wrap .head-wrap-inner .head-menu-top-nav ul .top-nav03
        {
            
            width:181px;
        }
      
        header .head-wrap-sub{
            position: absolute;
            top:60px;
            width: 1100px;
            height: 66px;
            border:var( --temp-border);
        }
        header .head-wrap-sub{
            display: flex;
            justify-content: flex-end;
            
        
        }
        header .head-wrap-sub ul{
           list-style: none;
           width: 737px;
            display: flex;
            justify-content:space-between;
         
            border:var( --temp-border);
           
        }
        header .head-wrap-sub ul li{
            text-align: center;
            flex: auto;
            
        }
        header .head-wrap-sub ul li a{
            text-decoration: none;
            display: block;
        
            border:var( --temp-border);
            text-transform: uppercase;
            font-size: 13px;
            padding-top: 10px;
            height: 66px;
        } 
        header .head-wrap-sub ul li a:hover{
            text-decoration: underline;
            background-color: #2c2a29;
            color:var( --color-font-green);
        }
      
        </style>
        </head>
      
        <body>
        <header>
            <div class="head-wrap">
                <div class="head-wrap-inner">
                    <h1><a href="/?id=admin">CCTV 관리 서비스</a></h1>
                    <nav class="head-menu-top-nav">
                        <ul>     
                            <li class="top-nav03"><a href="/">Log out</a></li>
                            <li class="top-nav04"><a href="#">MyPage</a></li>
                        </ul>
                    </nav> 
            </div>
            <div class="head-wrap-sub">
                <nav class="head-menu-main-nav">
                    <ul>
                        <li><a href="/?id=admin">Home</a></li>
                        <li><a href="/?id=LiveStream">CCTV LiveStream</a></li>
                        <li><a href="https://ejnu-my.sharepoint.com/:f:/g/personal/183097_jnu_ac_kr/EtEKiq9VlCtLtpMcvSIQAzYBlCB6NNGuhJvlRauk3q1_xw?e=WW7FPq">과거 영상</a></li>
                        <li><a href="">과거 결과</a></li>
                        <li><a href="/?id=Register">사용자 등록</a></li>
                        <li><a href="">사용자 삭제</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
        ${descrption}
      </body>
      
      `;
      response.end(template);
    });
});

app.listen(3000);