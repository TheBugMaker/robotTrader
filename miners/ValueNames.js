/**
 * Created by Dark on 16/04/2016.
 */
var ValuesNames = function() {
    var request = require('request');
    var cheerio = require('cheerio');

    var _getNames = function(callback ) {

        var url = 'http://www.ilboursa.com/';

        request(url , function(err , res , html){
            if(!err) {
                $ = cheerio.load(html);
                var valeurs = [] ;

                $("#ctl00_dpShares").children().each(function(i,elem){
                    if (i > 0 ){
                        valeurs.push({name : $(this).text() , urlName : $(this).attr('value')}) ;
                    }


                }) ;
                callback (null , valeurs) ;
            }else{
                callback(err) ;
            }
        });

    }

    return {
        getNames : _getNames
    }
}() ;

module.exports = ValuesNames ;