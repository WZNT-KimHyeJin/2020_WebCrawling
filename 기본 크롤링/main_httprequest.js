let printHello = () =>console.log("hello");
printHello();
var client = require('cheerio-httpcli');
var word ="스트레이키즈";
client.fetch('http://www.google.com/search',
{q: word}, function(err, $ ,res , body){
    console.log(res.headers);
    console.log($('title').text());
    $('a').each(function(idx){
        console.log($this).attr('href');
    });
});