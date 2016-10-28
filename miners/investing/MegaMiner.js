/**
 * Created by Dark on 25/04/2016.
 */
var MegaMiner = function() {
    var request = require('request');
    var cheerio = require('cheerio');

    var headers = {
        "User-Agent" : 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36' ,
        "X-Requested-With" : "XMLHttpRequest"
    } ;

    var _getnameUrl = function(isin , callBack){

        var url = 'http://www.investing.com/search/service/search' ;
        var form = {search_text:isin,term:isin,country_id:0,tab_id:"Stocks"} ;
        request.post( {url : url , form:form ,headers: headers} , function(err,res,data){

            var reg = /"link":"([^"]*)"/g ;
            var name = reg.exec(data) ;
            if(name instanceof Array){
                name = name[1] ;
            }
            if(name){
                name = name.replace('\\', '');
                name = name.replace('\\', '');
            }

            callBack(null , name);
        });
    }

    return {
        getNameUrl : _getnameUrl
    }
}() ;

module.exports = MegaMiner ;