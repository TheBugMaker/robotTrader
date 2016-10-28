/**
 * Created by Dark on 16/04/2016.
 */
var ValuesNames = function() {
    var request = require('request');
    var cheerio = require('cheerio');

    var _getUrlNames = function(callback ) {

        var url = 'http://www.investing.com/equities/TuNIsia';
        var options = {
            url : url ,
            headers : {
                "User-Agent" : 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36'
            }
        }
        request(options , function(err , res , html){
            if(!err) {
                var $ = cheerio.load(html);
                var valeurs = [] ;

                $("td.flag + td").each(function(i){
                    valeurs.push( { name : $(this).text() , url : String($(this).children().first().attr('title')).split(" ").join("-")}) ;
                });


                callback (null , valeurs) ;
            }else{
                callback(err) ;
            }
        });

    }

    return {
        getUrlNames : _getUrlNames
    }
}() ;

module.exports = ValuesNames ;