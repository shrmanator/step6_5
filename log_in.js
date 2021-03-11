const express = require('express');
const router = express.Router();
const mysql = require('./dbcon.js');

function getGuides(res, context, complete){
    mysql.pool.query("SELECT GuideRegistrations.email, GuideRegistrations.password FROM GuideRegistrations", function(error, results){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.guides = results;
        complete();
    });
}

router.get('/', function(req, res) {
    res.render('log_in')
})

router.get('/:email', function(req, res){
    var callbackCount = 0;
    var context = {};
    getGuides(res, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('log_in', context);
        }
    }

});

module.exports = router