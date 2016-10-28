/**
 * Created by Dark on 05/05/2016.
 */
var Teck = function() {
    var mongojs = require('mongojs');
    var db = mongojs("roboTrader") ;

    var values = db.collection('testCot') ;
    var teckVal = db.collection('teckVal') ;
    var training = db.collection('training') ;
    var test = db.collection('test') ;
    var COMA = db.collection('COMA') ;
    var FABI = db.collection('FABI') ;
    var RSI = db.collection('RSI') ;
    var MFI = db.collection('MFI') ;

    var runComa = function() {

        training.find({"begin": {$gt: new Date("2013-03-01")}}).sort({"SEANCE": 1}, function (err, vals) {
            console.log(vals.length);

            vals.forEach(function (v) {

                COMA.find({
                    VALEUR: v.VALEUR,
                    SEANCE: {$lte: v.begin}
                }).sort({SEANCE: -1}).limit(30, function (err, val) {
                    console.log(val.length);
                    if (val.length == 0) console.log("DAMN IT ");

                    var y = 0;
                    var above = true;

                    for (var i = 0; i < val.length; i++) {
                        var coma = val[i];

                        if (!coma) {
                            console.log("warning");
                            console.log(v);
                        } else {
                            if (i == 0) {
                                above = coma.macd > coma.signal;
                            } else {
                                if ((coma.macd > coma.signal) != above) {
                                    y = ((coma.macd > coma.signal) ? -1 : 1 );

                                    break;
                                }

                            }
                        }
                    }

                    if (y == 0) y = (above) ? 1 : -1;
                    v.comaY = y;
                    training.save(v);
                });


            });
        });

    }



    var runFab = function(){
        training.find({"begin": {$gt: new Date("2013-03-01")}}).sort({"SEANCE": 1}, function (err, vals) {
            console.log(vals.length);

            vals.forEach(function (v) {
                var up = 0  ;
                var down = 0 ;

                FABI.find({
                    VALEUR: v.VALEUR,
                    SEANCE: {$lte: v.begin}
                }).sort({SEANCE: -1}).limit(5, function (err, val) {


                    var old = 0  ;
                    for(var i = 0  ; i < val.length ; i++){
                        var cl = val[i] ;
                        if(i > 0 ){
                            if (cl.CLOTURE > old) { up++  ; }else {down ++ ;}
                        }
                        old = cl.CLOTURE  ;
                    }
                    var last = val[0] ;
                    var k = 0 ;
                    var min = 0 ;
                    var prop ="" ;
                    for (var property in last.fab30) {
                        if (last.fab30.hasOwnProperty(property)) {
                            if(k == 0) {
                               min = last.CLOTURE - last.fab30[property]  ;
                                prop = property ;
                            }else{
                                if(Math.abs(last.CLOTURE - last.fab30[property]) < Math.abs(min) ){
                                    min = last.CLOTURE - last.fab30[property] ;
                                    prop = property ;
                                }
                            }

                            k++ ;
                        }

                    }
                    var y = 0 ;
                    if(min > 0){
                        y = 1
                    }else {
                        y = -1 ;
                    }
                    v.fabiY = y;


                    training.save(v);

                });
            });
        });
    }

    var runRSI = function() {
        training.find({"begin": {$gt: new Date("2013-03-01")}}).sort({"SEANCE": 1}, function (err, vals) {
            console.log(vals.length);

            vals.forEach(function (v) {

                var y = 1  ;
                RSI.find({
                    VALEUR: v.VALEUR,
                    SEANCE: {$lte: v.begin}
                }).sort({SEANCE: -1}).limit(1, function (err, val) {
                    if(val && val[0].rsi12 < 50 ){
                        if(val[0].rsi12 < 30){
                            y=1 ;
                        }else{
                            y = -1 ;
                        }

                    }else{
                        if(val && val[0].rsi12 > 70 ){
                            y = -1
                        }else{
                            y = 1 ;
                        }

                    }

                    v.rsiY = y ;
                    training.save(v);
                });
            });
        });
    }

    var runMFI = function() {
        training.find({"begin": {$gt: new Date("2013-03-01")}}).sort({"SEANCE": 1}, function (err, vals) {
            console.log(vals.length);

            vals.forEach(function (v) {

                var y = -1  ;
                MFI.find({
                    VALEUR: v.VALEUR,
                    SEANCE: {$lte: v.begin}
                }).sort({SEANCE: -1}).limit(1, function (err, val) {
                    console.log(val);

                    if(val[0] && val[0].mfi14 < 50 ){
                        if(val[0].mfi14 < 30){
                            y = 1 ;
                        }else{
                            y = -1 ;
                        }

                    }else{
                        if(val[0] && val[0].mfi14 > 70 ){
                            y = -1
                        }else{
                            y = 1 ;
                        }

                    }

                    v.mfiY = y ;
                    training.save(v);
                });
            });
        });
    }

    return {
        runComa : runComa
    }
}() ;

module.exports = Teck ;