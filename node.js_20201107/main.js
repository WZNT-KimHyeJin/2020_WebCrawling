var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname =url.parse(_url,true).pathname;
    //사용자가 root로 접근했는가 아닌가
  /*
  query: [Object: null prototype] { id: 'CSS' },
  pathname: '/',
  path: '/?id=CSS',
  href: '/?id=CSS'
  */

  // pathname을 통해서는 home과 각각의 page를 구분할 수 없음
  // => 조건문 중첩사용을 통해 구분 가능.
  //무엇을 사용하여 구분할것이냐 : querydata.id => home이면 id가 존재하지 않고 각각의 page는 존재함.

 if(pathname === '/'){
   if(queryData.id=== undefined){

    fs.readdir('./data', function(error, filelist){
      var title = "wellcome";
      var description = "Hello, Node.js";
      var list ='<ul>';
      var i=0;
      while(i<filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i+=1;
      }
      list += '</ul>';
      var template = `
      <!doctype html>
      <html>
      <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      <h2>${title}</h2>
      <p>${description}</p>
      </body>
      </html>
      `;
      response.writeHead(200);
      response.end(template);
    }) //파일을 읽어 온 이후에 function을 수행함

    
   }else{
     var title = queryData.id;
    fs.readdir('./data', function(error, filelist){
      var title = "wellcome";
      var description = "Hello, Node.js";
      var list ='<ul>';
      var i=0;
      while(i<filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i+=1;
      }
      list += '</ul>';
     fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
       var template = `
       <!doctype html>
       <html>
       <head>
       <title>WEB1 - ${title}</title>
       <meta charset="utf-8">
       </head>
       <body>
       <h1><a href="/">WEB</a></h1>
       ${list}
       <h2>${title}</h2>
       <p>${description}</p>
       </body>
       </html>
       `;
       response.writeHead(200);
       response.end(template);
     });
    });
   }
 }else{
    response.writeHead(404); 
    //웹서버와 웹브라우저 사이에서 작동을 잘 했는지에 대한 
    //통신여부를 판단하는 수(?) 그냥 그 쯤으로 생각하면 됨.
    //==> 200을 출력하면 실행이 성공적으로 되었음을 뜻함
    // ==> 안되었을 경우 404라는 약속된 수를 반환
     response.end('Not Found');
 }

  
 
});
app.listen(3000);