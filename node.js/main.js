var http = require('http');
var fs = require('fs');
var url = require('url');
//require : 사용자가 http, fs, url을 요구한다는 의미
//url이라는 modul을 사용할 것임.

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url,true).query;
  // console.log(queryData.name);
  console.log("이 값을 봐야하네 : "+_url); // url을 분석해서 데이터를 추출 해야 함.
    if(_url == '/'){
      _url = '/index.html';
    }
    if(url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + _url));
 
});
app.listen(3000);