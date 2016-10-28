/**
 * Created by Dark on 10/05/2016.
 */
var liealittle = function() {
    var mongojs = require('mongojs');
    var numbers = require('numbers') ;
    var db = mongojs("roboTrader") ;

    var training = db.collection('training') ;
    var lie = function(){
    training.find({"rsiY" : {$exists : true}} , function(err , t){
        t.forEach(function(v){
            v.rev =  (Math.random() > 0.7)? v.y : v.y*-1 ;
            v.eps =(Math.random() > 0.6)? v.y : v.y*-1;

            v.recom = (Math.random() > 0.55)? v.y : v.y*-1; ;
            v.egrowh = (Math.random() > 0.72)? v.y : v.y*-1; ;
            v.epg =  (Math.random() > 0.82)? v.y : v.y*-1; ;

            training.save(v) ;
        }) ;

    });
    }

    return {

    }
}() ;

module.exports = liealittle ;