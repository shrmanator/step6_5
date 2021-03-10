const express = require('express');
const router = express.Router();
const mysql = require('./dbcon.js');

function getGuides(res, context, complete){
    mysql.pool.query("SELECT GuideRegistrations.userID as id, firstName, lastName, password, email, zipCode From GuideRegistrations", function(error, results, fields){
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

router.get('/:firstName', function(req, res){
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