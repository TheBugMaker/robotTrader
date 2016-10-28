/**
 * Created by Dark on 02/05/2016.
 */
var Technical = function() {
    var numbers = require('numbers');
    

    var mongojs = require('mongojs')
    var db = mongojs("roboTrader") ;
    var testCot= db.collection('testCot') ;
    var COMA = db.collection('COMA') ;
    var FABI = db.collection('FABI') ;
    var RSI = db.collection('RSI') ;
    var MFI = db.collection('MFI') ;


    _createMA = function( ){


        testCot.distinct("VALEUR",{$or : [{"GROUPE":11 },{"GROUPE":12 },{"GROUPE":51},{"GROUPE":52}]  }, function(err , r){


            r.forEach(function (v){


                testCot.find({"VALEUR":v}).sort( {SEANCE : 1},function(err , vals){
                    var size1 = 12  ;
                    var size2 = 26 ;
                    var size3 = 9 ;
                    var ma1 = [] ;var m1 = 2/(size1 + 1) ;
                    var ma2 = [] ;var m2 = 2/(size2 + 1) ;
                    var ma3 = [] ;var m3 = 2/(size3 + 1) ;


                        console.log(vals.length);
                        console.log(vals[0]);

                        for(var i = 0 ; i < vals.length ; i++){


                            val = vals[i] ;
                            var cl = Number(val.CLOTURE) ;
                            if(!cl || cl == 0 || cl== NaN ){ continue ; }

                            if(i>26){
                                var moy1 = numbers.statistic.mean(ma1) ;
                                var moy2 = numbers.statistic.mean(ma2) ;
                                var moy3 = numbers.statistic.mean(ma3) ;
                                var ema1 = ((cl - moy1) * m1 ) +  moy1 ;
                                var ema2 = ((cl - moy2) * m2 ) +  moy2 ;
                                var ema3 = null ;
                                var macd = ema1 - ema2  ;
                                ma3.unshift(macd) ;
                                if(ma3.length > size3 ){ ma3.pop()}
                                if(i > size3+size2){
                                    ema3 = ((macd - moy3) * m3 ) +  moy3 ;

                                    // put to db
                                    COMA.insert({SEANCE: val.SEANCE ,VALEUR : val.VALEUR,GROUPE : val.GROUPE, CLOTURE : val.CLOTURE , ema1 : ema1 , ema2:ema2 , signal : ema3 , macd : macd  , sma1 : moy1 , sma2 : moy2}) ;
                                };
                            }
                            ma1.unshift(cl) ;
                            ma2.unshift(cl) ;
                            if(ma1.length > size1 ){ ma1.pop()}
                            if(ma2.length > size2 ){ ma2.pop()}
                        }
                    });
            }) ;

        }) ;
    }
    _getFabi = function(fab){
        var min = numbers.basic.min(fab)  ;
        var max = numbers.basic.max(fab)  ;
        var d = max - min  ;

        var fab1 = d * 0.236 + min  ;
        var fab2 = d * 0.382 + min  ;
        var fab3 = d * 0.618 + min  ;
        return {
            min : min ,
            max : max  ,
            fab1 : fab1 ,
            fab2 : fab2 ,
            fab3 : fab3
        }
    }

    _Fabi = function(){
        testCot.distinct("VALEUR",{$or : [{"GROUPE":11 },{"GROUPE":12 },{"GROUPE":51},{"GROUPE":52}]  }, function(err , r){
            r.forEach(function (v){
                testCot.find({"VALEUR":v}).sort( {SEANCE : 1}, function(err , vals){
                    var s1=30, s2=50, s3=100 ; 
                    var fab30 = [] , fab50 = [], fab100 = [] ;  
                    
                    for(var i = 0 ; i < vals.length ; i++) {
                        val = vals[i];
                        var cl = Number(val.CLOTURE);
                        if (!cl || cl == 0 || cl == NaN) {
                            continue;
                        }
                        
                        // work
                        fab30.unshift(cl) ; if(fab30.length>30) fab30.pop() ;
                        fab50.unshift(cl) ; if(fab50.length>50) fab50.pop() ;
                        fab100.unshift(cl) ; if(fab100.length>100) fab100.pop() ;

                        var insert = {VALEUR : val.VALEUR , SEANCE: val.SEANCE ,  GROUPE : val.GROUPE , CLOTURE : val.CLOTURE} ;
                        insert.fab30 = _getFabi(fab30)  ;
                        insert.fab50 = _getFabi(fab50)  ;
                        insert.fab100 = _getFabi(fab100)  ;

                        FABI.insert(insert) ;
                    }
                    });
            }) ;
        });
    }
    _rsi = function(his){
        var up = 0, down = 0 ;
        for( var k = 0 ; k < his.length ; k++){
            if(his[k]) {up++ ; }else { down ++ ; }
        }
        return  100 - (100/( 1 + ( up / down )))
    }
    _getRSI = function () {
        testCot.distinct("VALEUR",{$or : [{"GROUPE":11 },{"GROUPE":12 },{"GROUPE":51},{"GROUPE":52}]  }, function(err , r){
            r.forEach(function (v){
                testCot.find({"VALEUR":v}).sort( {SEANCE : 1}, function(err , vals){
                    var oldCl = 0 ;

                    var his12 = [] ;
                    var his30 = [] ;
                    var his50 = [] ;

                    for(var i = 0 ; i < vals.length ; i++) {
                        val = vals[i];

                        var cl = Number(val.CLOTURE);
                        if (!cl || cl == 0 || cl == NaN) {
                            continue;
                        }

                        if(i > 1 ){
                            his12.unshift(oldCl>cl)  ;
                            his30.unshift(oldCl>cl)  ;
                            his50.unshift(oldCl>cl)  ;
                            if(his12.length > 12 ) his12.pop() ;
                            if(his30.length > 30 ) his30.pop() ;
                            if(his50.length > 50 ) his50.pop() ;

                        }
                        var insert = {VALEUR : val.VALEUR , SEANCE: val.SEANCE ,  GROUPE : val.GROUPE , CLOTURE : val.CLOTURE} ;
                        insert.rsi12 = _rsi(his12) ;
                        insert.rsi30 = _rsi(his30) ;
                        insert.rsi50 = _rsi(his50) ;

                        RSI.insert(insert);

                        oldCl = cl  ;
                    }
                });
            })
        }) ;
    }

    _calcMsi = function(his){

        return _rsi(his)  ;
    }
    _genMfi = function(){
        testCot.distinct("VALEUR",{$or : [{"GROUPE":11 },{"GROUPE":12 },{"GROUPE":51},{"GROUPE":52}]  }, function(err , r){
            r.forEach(function (v){
                testCot.find({"VALEUR":v}).sort( {SEANCE : 1}, function(err , vals){
                    var his14 = [] ;var his30 = [] ;
                    var oldRmf = 0 ;
                    for(var i = 0 ; i < vals.length ; i++) {
                        val = vals[i];

                        var cl = Number( (val.CLOTURE + val.PLUS_BAS + val.PLUS_HAUT)/3  );
                        if (!cl || cl == 0 || cl == NaN) {
                            continue;
                        }
                        var rmf = cl * val.NB_TRANSACTION ;
                        if(i > 1 ){
                            his14.unshift(oldRmf>rmf) ; if(his14.length > 14) his14.pop() ;
                            his30.unshift(oldRmf>rmf) ; if(his30.length > 30) his30.pop() ;
                            var insert = {VALEUR : val.VALEUR , SEANCE: val.SEANCE ,  GROUPE : val.GROUPE , CLOTURE : val.CLOTURE} ;
                            insert.mfi14 = _rsi(his14) ;
                            insert.mfi30 = _rsi(his30) ;


                            MFI.insert(insert);
                        }
                        oldRmf = rmf ;
                    }
                });
            });
        }) ;



    }


    return {
        createMA : _createMA ,
        fabi : _Fabi ,
        getRsi  : _getRSI ,
        genMFI : _genMfi
    }
}() ;

module.exports = Technical ; 