/**
 * Created by Dark on 16/04/2016.
 */

var express = require('express');
var router = express.Router();

var nameMiner = require('../miners/ValueNames');
var revMiner = require('../miners/Revenus');
var epsMiner = require('../miners/EPS') ;
var growthMiner = require('../miners/EGrowth') ;
var recMiner = require('../miners/Recom');
var ISINMiner = require('../miners/ISIN') ;
var EPGMiner = require('../miners/EPG') ;

// investing.com
var urlMiner = require('../miners/investing/ValueNames') ;
var MegaMiner = require('../miners/investing/MegaMiner') ;

var val = require('../db/value') ;
/* GET users listing. */
router.get('/setNames', function(req, res, next) {
    nameMiner.getNames(function(err , vals ){
        res.json(vals) ;

        vals.forEach(function (v){
           var valeur = new val.model(v) ;

            valeur.save() ;
        });
    }) ;
});

router.get('/setRev' , function(req,res){
    val.model.find({},function(err , vals){
        vals.forEach(function(v){
            revMiner.getRev(v.urlName,function(err,his){
                console.log(his);
                v.rev = {history : his } ;
                v.save();
            });
        }) ;


        res.end('done !') ;
    });
}) ;
router.get('/setEps' , function(req,res){
    val.model.find({},function(err , vals){
        vals.forEach(function(v){
            epsMiner.getEPS(v.urlName,function(err,his){
                v.EPS = {history : his } ;
                v.save();
            });
        }) ;


        res.end('done !') ;
    });
}) ;

router.get('/setGrowth' , function(req,res){
    val.model.find({},function(err , vals){
        vals.forEach(function(v){
            growthMiner.getGrowth(v.urlName,function(err,his){
                console.log(his);

                v.EGrowth = {history : his } ;
                v.save();
            });
        }) ;


        res.end('done !') ;
    });
}) ;

router.get('/setRecom' , function(req,res){
    recMiner.getRecom(function(err,recs){
         recs.forEach(function(r){
             val.model.findOne({name: r.name} , function(err,v){
                 if(v!=null){

                     v.recom = {recs : Number(r.recs) , pass : r.recs === 4} ;
                     v.save() ;
                 }

             });
         });
        res.end('done!');
    });
});

router.get('/setUrlNames' , function(req,res){
    urlMiner.getUrlNames(function(err , values ){

        values.forEach(function(v){
            val.model.findOne({name: String(v.name).toUpperCase()}, function(err, value ){
                if(!value){
                    val.model.findOne({name: String(v.url).toUpperCase().split('-').join(' ')}, function(err, value){
                        if(value){
                            value.nameUrl = v.url ;
                            value.save();
                        }else{
                            console.log("not SET "+ v.name);

                        }
                    });
                }else{
                    value.nameUrl = v.url ;
                    value.save();
                }
            }) ;
        });
    }) ;
    res.end('done!') ;
});

router.get('/setISIN' , function(req,res){

    val.model.find({},function(err , vals){
        vals.forEach(function(v){
            ISINMiner.getISIN(v.urlName,function(err,isin){
                v.ISIN = isin ;
                v.save() ;
               // v.EGrowth = {history : his } ;
               // v.save();
            });
        }) ;


        res.end('done !') ;
    });
});

router.get('/setNameUrl' , function(req,res){
    val.model.find({}, function(err , vals){
        vals.forEach(function(v){
            MegaMiner.getNameUrl(v.ISIN , function(err  , url){
                console.log(url);
                v.nameUrl = url ;
                v.save();
            }) ;
        }) ;
        res.end('done !');
    }) ;

}) ;

router.get('/setPEG' , function(res,res){
    val.model.find({},function(err , vals){
        vals.forEach(function(v){
            EPGMiner.getEPG(v.urlName,function(err,his){

                v.PEG = {history : his } ;
                v.save();
            });
        }) ;


        res.end('done !') ;
    });
});

module.exports = router;
