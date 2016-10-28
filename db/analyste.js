/**
 * Created by Dark on 15/04/2016.
 */
var Analyste= function() {
    var mongoose = require('mongoose');

    var AnalysteSchema = new mongoose.Schema({
        name : String ,
        score : String
    });
    var _analyste = mongoose.model('Analystes',_AnalysteSchema) ;
    return {
       model : _analyste
    }
}() ;

module.exports = Analyste ;