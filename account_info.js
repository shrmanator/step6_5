const express = require('express');
const router = express.Router();
const mysql = require('./dbcon.js');


router.get('/', function(req, res){
    res.render('account_info')
});

/*
METHOD WORKS!!!
 Adds a guide, redirects to the people page after adding */
router.post('/', function(req, res) {
    var sql = "INSERT INTO GuideRegistrations (firstName, lastName, password, email, zipCode, climate) VALUES (?,?,?,?,?,?)";
    var inserts = [req.body.firstName, req.body.lastName, req.body.password, req.body.email, req.body.zipCode, req.body.climate];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.render('account_info');
        }
    });
});

module.exports = router