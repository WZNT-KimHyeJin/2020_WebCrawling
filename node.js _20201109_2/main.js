var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


function templateHTML(title, list, body, control){
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
  ${control}
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
        var template = templateHTML(title, list, 
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`
          //home에서는 update가 일어나면 안됨 =><a href="/update">update</a> 삭제
      );
        response.writeHead(200);
        response.end(template);
      })

      
    }else{
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list, 
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a> 
          <a href="/update?id=${title}">update</a> 
          <form action="delete_process" method="Post">
            <input type="hidden" name="id" value ="${title}">
            <input type ="submit" value="delete"> 
          </form>`
          //query Id 값으로 변경될 것을 넘김
          );
          //id값이 존재하는 page이기 때문에 업뎃
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
      <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder ="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
      </form>
        `,"");
      response.writeHead(200);
      response.end(template);
    }); //create로 들어갔을 때 create 링크가 보이지 않도록 함.
  }else if(pathname === "/create_process"){
    var body = '';
      request.on('data', function(data){ 
          body = body + data;
      });
      request.on('end', function(){ 
          var post = qs.parse(body);
          var title = post.title; // 제목
          var description = post.description //본문
          fs.writeFile(`data/${title}`, description, 'utf8', 
          function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end("success!");
          })
      });
  }else if(pathname == `/update`){
    fs.readdir('./data', function(error, filelist){
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
      var title = queryData.id;
      var list = templateList(filelist);
      var template = templateHTML(title, list, 
        `
        <form action="/update_process" method="post">
        <input type="hidden" name ="id" value="${title}">
      <p><input type="text" name="title" placeholder ="title" value="${title}"></p>
      <p>
        <textarea name="description" placeholder="description">${description}</textarea>
      </p>
      <p>
        <input type="submit">
      </p>
      </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        
      response.writeHead(200);
      response.end(template);
    });
    });
  }else if(pathname==='/update_process'){
    var body = '';
      request.on('data', function(data){ 
          body = body + data;
      });
      request.on('end', function(){ 
          var post = qs.parse(body);
          var id =post.id;
          var title = post.title; // 제목
          var description = post.description //본문

        fs.rename(`data/${id}`,`data/${title}`, function(err){
          fs.writeFile(`data/${title}`, description, 'utf8', 
          function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        })

          
      });
  }else if(pathname==='/delete_process'){
    var body = '';
      request.on('data', function(data){ 
          body = body + data;
      });
      request.on('end', function(){ 
          var post = qs.parse(body);
          var id =post.id;
          fs.unlink(`data/${id}`,function(err){
            response.writeHead(302, {Location: `/`});
            response.end();
          })          
      });
  }
  else{
      response.writeHead(404); 
      response.end('Not Found');
  }

  
 
});
app.listen(3000);