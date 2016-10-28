/**
 * Created by Dark on 23/02/2016.
 */
var Myfb = function() {
    var FB = require('fb');
    FB.setAccessToken("49187bda06c438a3afe431ee97a270e8")  ;

    var _getPost = function(pageId, callback){
        FB.api("/"+pageId+"/posts" , callback);
    }

    return {
        getPost : _getPost
    }
}() ;

module.exports = Myfb  ;