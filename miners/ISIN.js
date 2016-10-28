/**
 * Created by Dark on 18/04/2016.
 */
/**
 * Created by Dark on 16/04/2016.
 */

var ISIN = function() {
    var request = require('request');
    var cheerio = require('cheerio');
    var async = require('async');
    var _getISIN = function(nameUrl , callback){
        var url = 'http://www.ilboursa.com/marches/societe.aspx?s=' ;
        request(url+nameUrl , function(err , res , html){
            if(!err){
                var $ = cheerio.load(html);

                var isin = $('.innerUpu').eq(0).text() ;
                if(isin && isin.length > 15){
                    isin = isin.split('-')[0] ;
                    isin = isin.split(':')[1].split(' ').join() ;
                    isin = isin.replace(',','').replace(',','');


                }else{
                    isin = ""  ;
                    console.log(nameUrl + " NOT FOUND ISIN");
                }
                callback(null , isin ) ;

            }else{
                callback(err);
            }

        });
    }

    return {
        getISIN : _getISIN
    }
}() ;

module.exports = ISIN ;