/**
 * Created by Dark on 16/04/2016.
 */

var Recom = function() {
    var request = require('request');
    var cheerio = require('cheerio');

    var _getRecom = function( callback){
        var url = 'http://www.ilboursa.com/analyses/synthese_fiches.aspx' ;
        request(url , function(err , res , html){
            if(!err){
                var $ = cheerio.load(html);
                var recom = [] ;
                $("td a").each(function(i){
                    recom[i] = {name : $(this).text()} ;


                });
                $(".alct img").each(function(i){
                    var img = $(this).attr('src');


                    var score = 1 ;
                    if(img === '/i/f_3b.png') score = 3 ;
                    if(img === '/i/f_1b.png') score = 4 ;
                    if(img === '/i/f_4b.png') score = 2 ;

                    recom[i].recs = score ;
                });

                callback(null , recom) ;



            }else{
                callback(err);
            }

        });
    }

    return {
        getRecom : _getRecom
    }
}() ;

module.exports = Recom ;