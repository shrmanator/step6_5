const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('./dbcon.js');
// const session = require('/express-session');
app.use(express)
// app.use(session({
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: false
// }));

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
//
// /* Associate certificate or certificates with a person and
//  * then redirect to the guides_with_certs page after adding
//  */
// router.post('/', function(req, res){
//     var mysql = req.app.get('mysql');
//     var email = req.body.email;
//     let password = req.body.password;
//     var sql = "SELECT GR.email, GR.password FROM GuideRegistrations GR WHERE GR.email = ? AND GR.password = ?";
//
//     sql = mysql.pool.query(sql, [email, password], function(error, results, fields){
//         if(error){
//             console.log("Your email or password is incorrect.")
//         }
//     });
//
//     if (!req.sessions.viewCount) {
//         req.session.viewCount = 1
//     }
//     else {
//         req.session.viewCount += 1;
//     }
//     res.render('/log_in', {viewCount: req.session.viewCount});
// });

module.exports = router