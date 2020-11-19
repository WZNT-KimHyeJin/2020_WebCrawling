const request = require('request');
const cheerio = require('cheerio');
const axios = require("axios");

const getHtml = async() => {
    try{
        return await axios.get("http://tv.jtbc.joins.com/plan/pr10010943");
    }catch(err){
        console.error("이요잉용");
    }
};

axios.get(url).then(html =>{
    let List =[];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.program_txt01");

    $bodyList.each(function(i, elem) {
        List[i] ={
        contents : $(this).find('p').text()
        };
    });
    const data = List.filter(n => n.title);
    return res.json(data);
}).then(res => console.log(res));

// const lolo = (path, url) =>{
//     request(
//         {
//             url :url,
//             headers : {'referer':"http://tv.jtbc.joins.com/plan/pr10010943"},
//             encoding :null},
//             function(err, response, body){
//                 console.error('err:',err);
//                 console.log('statusCode', response && response.statusCode);
//             }
//         }
//     )
// }

