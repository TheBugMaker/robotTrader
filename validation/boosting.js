/**
 * Created by Dark on 06/05/2016.
 */
var AdaBoosting = function() {
    var mongojs = require('mongojs');
    var async = require('async') ;
    var db = mongojs("roboTrader") ;

    var training = db.collection('training') ;
    var T =["comaY","fabiY","rsiY","mfiY" , "rev" , 'eps' , 'epg' , 'recom' , 'egrowth'] ;

    var H= [] ;
    var fdams = function() {
        training.find({"rsiY": {$exists: true}}, function (err, v) {
            for (var i = 0; i < v.length; i++) {
                var e = v[i];
                e.d = String(1 / v.length );
                training.save(e);
            }
            ;


            // training
            while (T.length > 0) {
                var min = 0;
                var t = "";
                var temp = [] ;

                for (var i = 0; i < T.length; i++) {
                    temp[i] = 0 ;
                    for( var k = 0  ; k < v.length ; k++){
                        if (v[k][T[i]] != v[k]['y']) {
                            temp[i]+= Number(v[k].d) ;
                        }
                    }
                    temp[i] = temp[i]/ v.length ;
                }


                for(var c = 0  ; c < temp.length ; c++){
                    if(c == 0){
                        min = temp[c] ;
                        t = T[c];
                    }else{
                        if(temp[c] < min){
                            min = temp[c] ;
                            t = T[c];
                        }
                    }
                }
                var lam = 1/2 * Math.log(((1-min) / min )) ;
                var lastt = {t : t , alpa : lam} ;
                H.push(lastt) ;

                var norm = 0 ;
                for( var k = 0  ; k < v.length ; k++){
                    v[k].d = v[k].d * Math.exp(lastt.alpa * v[k].y * v [k][t] * -1 ) ;



                    norm +=  (v[k].d * Math.exp(lastt.alpa * v[k].y * v[k][t] * -1 )) ;

                }
                for( var k = 0  ; k < v.length ; k++){
                    v[k].d =  v[k].d / norm ;
                }

                T.splice(T.indexOf(t) , 1) ;

            }
            console.log(H);
            var err = 0 ;

            for( var k = 0  ; k < v.length ; k++){
                var h = 0  ;
                for( var x = 0  ; x < H.length  ; x++ ){
                    h += H[x].alpa * v[k][H[x].t] ;

                    
                }
                if(h * v[k].y  < 0 ){
                    err ++  ;
                }
            }

            console.log(err );

        });


    }

    fdams() ;




    return {

    }
}() ;

module.exports = AdaBoosting ;