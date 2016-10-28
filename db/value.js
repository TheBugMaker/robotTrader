/**
 * Created by Dark on 15/04/2016.
 */
var Value = function() {
    var mongoose = require('mongoose');

    var rec = { history : [{_id : false , year : String , val : String }] , pass : Boolean }  ;
    var valueSchema = new mongoose.Schema({
        ISIN : {type : String , unique : true } ,
        name : {type : String , unique : true } ,
        urlName : {type : String , unique : true } , // ilboursa
        nameUrl : {type : String , unique : true } , // investing.com
        rev :  rec , // revenues
        EPS : rec , // revenues / share
        ROE : rec , // Net Income/Shareholder's Equity
        recom : {_id:false ,recs : Number , pass : Boolean } ,  // analystes Recomandations
        EPSS : rec , // earning surprises  :  EPS expected - Actual EPS
        fEPS : rec , // forcast : future EPS predictions
        EGrowth : rec , // earning growth
        PEG : rec , // PEG Ratio
        IndEarning : rec , //  Industry Price-Earnings
        DTC : {val : String , pass : Boolean } , // Days to Cover
        insiders : rec , // insider tradings
        Alpha : rec , //  Weighted Alpha
    });

    var _value = mongoose.model('Values',valueSchema) ;
    return {
        model : _value
    }
}() ;

module.exports = Value ;