/**
 * Created by Dark on 06/05/2016.
 */
var TrainData = function() {
    var mongojs = require('mongojs');
    var db = mongojs("roboTrader") ;

    var values = db.collection('training') ;
    var testCot = db.collection('testCot') ;
    var period = 30  ;
    var run =  function() {
        values.remove({});
        testCot.distinct("VALEUR", {$or: [{"GROUPE": 11}, {"GROUPE": 12}, {"GROUPE": 51}, {"GROUPE": 52}]}, function (err, r) {


            r.forEach(function (v) {

                testCot.find({"VALEUR": v}).sort({SEANCE: 1}, function (err, vals) {
                    var p = period;
                    var up = 0;
                    var down = 0;
                    var startVal = 0;
                    var begin = 0;
                    for (var i = 0; i < vals.length; i++) {
                        val = vals[i];
                        var cl = Number(val.CLOTURE);
                        if (!cl || cl == 0 || cl == NaN) {
                            continue;
                        }

                        if (p < period) {
                            if (startVal < cl) {
                                up++;
                            } else {
                                down++;
                            }

                        } else {
                            startVal = cl;
                            begin = val.SEANCE;
                        }
                        p--;

                        if (p == 0) {
                            var insert = {
                                SEANCE: val.SEANCE,
                                VALEUR: val.VALEUR,
                                GROUPE: val.GROUPE,
                                CLOTURE: val.CLOTURE,
                                START: startVal,
                                CODE: val.CODE
                            };
                            insert.begin = begin;
                            insert.y = (up > down) ? 1 : -1;
                            values.insert(insert);
                            p = period;
                            up = 0;
                            down = 0;
                        }
                    }
                });
            });
        });
    }
   // run() ;
    return {
        run : run
    }
}() ;

module.exports = TrainData ;