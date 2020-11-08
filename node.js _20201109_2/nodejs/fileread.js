var fs = require('fs'); //파일 시스템을 다루게 됨.
fs.readFile('sample.txt','utf8', function(err,data){
    console.log(data);
});