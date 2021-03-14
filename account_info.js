const express = require('express');
const router = express.Router();
const mysql = require('./dbcon.js');

route = 'account_info'

function getClimates(res, context, complete){
    mysql.pool.query("SELECT climate from GuideClimates", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.climates  = results;
        complete();
    });
}

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

function getGuidesByClimate(req, res, context, complete){
    var query = "SELECT * FROM GuideRegistrations CG INNER JOIN GuideClimates GC on CG.userID = GC.userID WHERE GC.climate = ?";
    var inserts = [req.params.climate]
    mysql.pool.query(query, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.guides = results;
        complete();
    });
}

function getGuide(res, context, id, complete){
    var sql = "SELECT GuideRegistrations.userID as id, firstName,lastName,password,email,zipCode,climate From GuideRegistrations WHERE userID = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.guide = results;
        complete();
    });
}

/*Display all people. Requires web based javascript to delete users with AJAX*/
router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    getGuide(res, context, 17, complete);
    getClimates(res, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            console.log(context)
            res.render(route, context);
        }
    }
});

/*Display all people from a given climate. Requires web based javascript to delete users with AJAX*/
router.get('/filter/:climate', function(req, res){
    console.log("guide.js 84");
    var callbackCount = 0;
    var context = {};
    getClimates(res, context, complete);
    getGuidesByClimate(req, res, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render(route, context);
        }
    }
});


/*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
router.get('/search/:s', function(req, res){
    var callbackCount = 0;
    var context = {};
    // context.jsscripts = ["deleteguide.js","filterguides.js","searchguides.js"];
    // var mysql = req.app.get('mysql');
    getGuidesByClimate(req, res, context, complete);
    getClimates(res, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render(route, context);
        }
    }
});

/* Display one guide for the specific purpose of updating guides (used in sign_up.handlebars) */
router.get('/:id', function(req, res){
    var callbackCount = 0;
    var context = {};
    getGuide(res, context, req.params.id, complete);
    getClimates(res, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('account_info', context);
        }
    }
});

/*
METHOD WORKS!!!
 Adds a guide, redirects to the people page after adding */
router.post('/', function(req, res) {
    console.log(req.body.climates)
    console.log(req.body)
    // var mysql = req.app.get('mysql');
    var sql = "INSERT INTO GuideRegistrations (firstName, lastName, password, email, zipCode, climate) VALUES (?,?,?,?,?,?)";
    var inserts = [req.body.firstName, req.body.lastName, req.body.password, req.body.email, req.body.zipCode, req.body.climate];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/account_info');
        }
    });
});

/* The URL that update data is sent to in order to update a guide */
router.put('/:account_info', function(req, res){
    // var mysql = req.app.get('mysql');
    console.log(req.body)
    console.log(req.params.id)
    var sql = "UPDATE GuideRegistrations SET firstName=?, lastName=?, email=?, climate=?, zipCode=? WHERE userID=?";
    var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.body.climate, req.body.zipCode, req.params.id];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(200);
            res.end();
        }
    });
});

/* Route to delete a guide, simply returns a 202 upon success. Ajax will handle this. */
router.delete('/:id', function(req, res){
    // var mysql = req.app.get('mysql');
    var sql = "DELETE FROM GuideRegistrations WHERE userID = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            console.log(error)
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.status(202).end();
        }
    })
})

module.exports = router
