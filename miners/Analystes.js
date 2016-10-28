/**
 * Created by Dark on 16/04/2016.
 */

var Analystes = function() {
    var request = require('request');
    var cheerio = require('cheerio');

    var _getAnalystes = function(nameUrl , callback){
        var url = 'http://www.ilboursa.com/marches/societe.aspx?s=' ;
        request(url+nameUrl , function(err , res , html){
            if(!err){
                var $ = cheerio.load(html);
                var analystes = [] ;



                callback(null , analystes) ;



            }else{
                callback(err);
            }

        });
    }

    return {
        getAnalystes : _getAnalystes
    }
}() ;

module.exports = Analystes ;