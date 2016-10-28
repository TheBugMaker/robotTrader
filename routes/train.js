/**
 * Created by Dark on 02/05/2016.
 */
var express = require('express');
var router = express.Router();
var fund = require('../validation/fundamental')  ;
var train = require('../validation/trainData')  ;
var technical = require('../validation/technical')  ;
var lielitte = require('../validation/liealittle') ;
var gogogogog = require('../validation/boosting') ;

/* GET users listing. */
router.get('/MA', function(req, res, next) {

});

module.exports = router;
