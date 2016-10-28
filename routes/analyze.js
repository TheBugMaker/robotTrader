/**
 * Created by Dark on 02/05/2016.
 */
var express = require('express');
var router = express.Router();
var t = require('../analystes/technical')  ;

/* GET users listing. */
router.get('/MA', function(req, res, next) {
    t.createMA() ;
    res.end() ;
});
router.get('/FAB', function(req, res, next) {
    t.fabi();
    res.end("done !") ;
});
router.get('/RSI', function(req, res, next) {
    t.getRsi() ;
    res.end("done !") ;
});
router.get('/MFI', function(req, res, next) {
    t.genMFI() ;
    res.end("done !") ;
});


module.exports = router;
