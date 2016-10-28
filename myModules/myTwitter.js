/**
 * Created by Dark on 22/02/2016.
 */
var MyTwitter = function() {
    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: 'HmkD1cabdCrSukuiP5QKafbTP',
        consumer_secret: 'ajE3Vyax81NLLcyIIH1rF74vYMJ11YrpVswPYv7grH5q0GrWo2',
        access_token_key: '701863995389693952-7LtVn56tAbGsJvpNtQUPChLjalkUVwp',
        access_token_secret: 'VqeGyaTFNyRHDfVy4kEnoE1VRs0Vrb0yf4t4lWLW19ZbV'
    });
    /**
     * get tweets of a user by screen name
     * @param user {String} user csreen name
     * @param callback
     * @private
     */
    var _getTweets = function( user , callback ){
        client.get("statuses/user_timeline",{screen_name:user} , callback ) ;
    }

    return {
        getTweets : _getTweets
    }
}() ;

module.exports = MyTwitter ;