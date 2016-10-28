/**
 * Created by Dark on 05/05/2016.
 */
var Fund = function() {
    var mongojs = require('mongojs') ;
    var db = mongojs("roboTrader") ;

    var values = db.collection('values') ;
    var fundVal = db.collection('fundVal') ;
    var training = db.collection('training') ;
    _peg = function(v , year ){
        var val = 0 ;

        for(var i = 0 ; i < v.PEG.history.length ; i++ ){
            var peg =  v.PEG.history[i] ;
            val = (isNaN(Number(peg.val)))? val : Number(peg.val) ;
            if(Number(peg.year) == year ) break ;
        }

        return (val > 1.0)? 1 : -1 ;
    }

    _eGrow = function( v  , year){
        var val = 0 ;

        for(var i = 0 ; i < v.EGrowth.history.length ; i++ ){
            var peg =  v.EGrowth.history[i] ;
            val = (isNaN(Number(peg.val)))? val : Number(peg.val) ;
            if(Number(peg.year) == year ) break ;
        }

        return (val > 8.0)? 1 : -1 ;
    }
    _recom = function(v,year){
        if(v.recom && v.recom.pass=== true) return 1  ;
        return -1  ;
    }
    _EPS = function( v  , year){
        var val = 0 ;
        var oldval = 0 ;
        var y = 1 ;
        for(var i = 0 ; i < v.EPS.history.length ; i++ ){
            var peg =  v.EPS.history[i] ;
            val = (isNaN(Number(peg.val)))? val : Number(peg.val) ;
            if(i > 0 ){
                if(oldval > val )  y = -1  ;
            }
            oldval = val  ;
            if(Number(peg.year) == year ) break ;
        }

        return y ;
    }
    _rev = function( v  , year){
        var val = 0 ;
        var oldval = 0 ;
        var y = 1 ;
        for(var i = 0 ; i < v.rev.history.length ; i++ ){
            var peg =  v.rev.history[i] ;
            val = (isNaN(Number(peg.val)))? val : Number(peg.val) ;
            if(i > 0 ){
                if(oldval > val )  y = -1  ;
            }
            oldval = val  ;
            if(Number(peg.year) == year ) break ;
        }

        return y ;
    }
    var _run = function(){

    fundVal.remove({}) ;
        values.find(function(err,vals){
            vals.forEach(function(v){
                var his = [] ;
                var hisEG =[] ;
                var hisRec = [];
                var hisEPS = [];
                var hisRev= []  ;
                for(var i = 2012 ; i < 2016 ; i++){
                    his.push({year : i , peg : _peg (v,i) }) ;
                    hisEG.push({year : i , EG : _eGrow (v,i) }) ;
                    hisRec.push({year : i , RC : _recom (v,i) }) ;
                    hisEPS.push({year : i , EPS : _EPS (v,i) }) ;
                    hisRev.push({year : i , REV : _rev (v,i) }) ;
                }
                var insert = {name : v.name , urlName : v.urlName  , PEG : his , EGrowth : hisEG , recom : hisRec , EPS : hisEPS , REV : hisRev } ;
                fundVal.insert(insert) ;
            }) ;

        });
    }
    var attachISIN = function(){
    fundVal.find(function(err,vals){
           vals.forEach(function(v){
               values.findOne({urlName : v.urlName},function(err, vv){
                   console.log(vv);
                   if(vv.ISIN){

                   var isin = vv.ISIN ;
                   isin = isin.substring(5 , isin.length-1);
                   v.CODE = isin ;
                   fundVal.save(v);}
               });
           });
        });
    }
   /* training.find({"begin": {$gt: new Date("2013-03-01")}}).sort({"SEANCE": 1}, function (err, vals) {
        console.log(vals.length);

        vals.forEach(function (v) {
            fundVal.find({$or: [{name : v.VALEUR } , {CODE : v.CODE} ]}  , function(err, vals){
                if(vals.length > 0 ){

                }
            });

        });
    });
    */

    return {
        run : _run
    }
}() ;

module.exports = Fund ;