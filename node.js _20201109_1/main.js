var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
  </head>
  <body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  <a href="/create">create</a>
  ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list ='<ul>';
        var i=0;
        while(i<filelist.length){
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i+=1;
        }
        list += '</ul>';
        return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname =url.parse(_url,true).pathname;
   
  if(pathname === '/'){
    if(queryData.id=== undefined){

      fs.readdir('./data', function(error, filelist){
        var title = "wellcome";
        var description = "Hello, Node.js";
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(template);
      })

      
    }else{
      var title = queryData.id;
      fs.readdir('./data', function(error, filelist){
        var list = templateList(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(template);
      });
      });
    }
  }else if(pathname === "/create"){
    fs.readdir('./data', function(error, filelist){
      var title = "WEB - create";
      var list = templateList(filelist);
      var template = templateHTML(title, list, `
      <form action="http://localhost:3000/create_process" method="post">
      <p><input type="text" name="title" placeholder ="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
      </form>
        `);
      response.writeHead(200);
      response.end(template);
    });
  }else if(pathname === "/create_process"){
    var body = '';
      request.on('data', function(data){ 
        // create 서버에 설정된 callbac함수에 있는 request
        // ?? 왜 request : 사용자가 요청한 정보 안에 post가 있을 것임.
        // 서버쪽에서 일정 데이터양을 수신할 때마다  callback함수 실행
        // 그리고 이를 호출할 때 data라는 인자를 통해서 수신한 정보를 전달하기로 함.
          body = body + data;
          // callback함수가 실행할 때마다 받아온 일정 데이터를 추가한다. 
          /*
          if(body.length > 1e6){
            request.connection.destroy(); => 데이터가 너무 커질경우 끊어냄
            사용은 안할거임 그냥 알아두기
          }
           */
      });
      request.on('end', function(){ //더이상 들어올 정보가 없을 때.callback 실행
          //정보 수신이 종료
          var post = qs.parse(body);
          //qs 는 queryString 모듈 반환
          //post로 받아온 객체를 post에 저장
          var title = post.title; // 제목
          var description = post.description //본문
          fs.writeFile(`data/${title}`, description, 'utf8', 
          function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            //302는 redirection 수행과 동시에 생성한 창으로 이동하게 됨.
            response.end("success!");
          })
      });
  }
  else{
      response.writeHead(404); 
      response.end('Not Found');
  }

  
 
});
app.listen(3000);