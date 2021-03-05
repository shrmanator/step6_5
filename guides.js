console.log("guide.js open")
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getClimates(res, mysql, context, complete){
        mysql.pool.query("SELECT climate from GuideClimates", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.climates  = results;
            complete();
        });
    }

    function getGuides(res, mysql, context, complete){
        mysql.pool.query("SELECT GuideRegistrations.userID as id, firstName, lastName, password, email, zipCode From GuideRegistrations", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guides = results;
            complete();
        });
    }

    function getGuidesByClimate(req, res, mysql, context, complete){
        var query = "SELECT * FROM GuideRegistrations CG INNER JOIN GuideClimates GC on CG.userID = GC.userID";
        var inserts = [req.params.climate]
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.climate = results;
            console.log(results)
            complete();
        });
    }

    // /* Find people whose fname starts with a given string in the req */
    // function getPeopleWithNameLike(req, res, mysql, context, complete) {
    //   //sanitize the input as well as include the % character
    //    var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
    //   console.log(query)
    //
    //   mysql.pool.query(query, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }cs340_shermado
    //         context.people = results;
    //         complete();
    //     });
    // }

    function getGuide(res, mysql, context, id, complete){
        var sql = "SELECT GuideRegistrations.userID as id, firstName, lastName,password,email,zipCode From GuideRegistrations WHERE userID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guide = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteguide.js","filterguides.js","searchguides.js"];
        var mysql = req.app.get('mysql');
        getGuides(res, mysql, context, complete);
        getClimates(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('guides', context);
            }

        }
    });

    /*Display all people from a given climate. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:climates', function(req, res){
        console.log(req.params);
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteguide.js","filterguides.js","searchguides.js"];
        var mysql = req.app.get('mysql');
        getGuidesByClimate(req,res, mysql, context, complete);
        getClimates(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('guides', context);
            }
        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteguide.js","filterguides.js","searchguides.js"];
        var mysql = req.app.get('mysql');
        getGuidesByClimate(req, res, mysql, context, complete);
        getClimates(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('guides', context);
            }
        }
    });

    /* Display one guide for the specific purpose of updating people (used in home.handlebars) */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedclimates.js", "updateguides.js"];
        var mysql = req.app.get('mysql');
        getGuide(res, mysql, context, req.params.id, complete);
        getClimates(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-guide', context);
            }
        }
    });

    /* Adds a guide, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.climates)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO GuideRegistrations (firstName, lastName,email,zipCode) VALUES (?,?,?,?)";
        var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.body.zipCode];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/guides');
            }
        });
    });

    /* The URI that update data is sent to in order to update a guide */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE GuideRegistrations SET firstName=?, lastName=?, email=?, zipCode=? WHERE userID=?";
        var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.body.zipCode, req.params.id];
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
        var mysql = req.app.get('mysql');
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

    return router;
}();