/**
 * Created by Dark on 16/04/2016.
 */

var Growth = function() {
    var request = require('request');
    var cheerio = require('cheerio');

    var _getGrowth = function(nameUrl , callback){
        var url = 'http://www.ilboursa.com/marches/societe.aspx?s=' ;
        request(url+nameUrl , function(err , res , html){
            if(!err){
               var $ = cheerio.load(html);
               var history = [] ;


               $('thead .alri').first().children().each(function(i){
                   if(i>0) {
                       var y = $(this).text().substring(0,4);
                       history[i] = {year : y} ;
                   }
               });


               $('tbody .alri').eq(3).children().each(function(i){
                   if(i>0){
                       var rev = $(this).text().replace(",",".");
                       rev = rev.replace('','').replace('%','');


                       if(isNaN(Number(rev))){
                            delete history[i] ;
                       }else{
                           history[i].val = rev ;
                       }
                   }
               });
                history = history.filter(function(n){ return n != undefined }) ;
               callback(null , history) ;



            }else{
                callback(err);
            }

        });
    }

    return {
        getGrowth : _getGrowth
    }
}() ;

module.exports = Growth ;