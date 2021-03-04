module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function serveClimates(req, res){
        console.log("You asked me for some guides?")
        var query = 'SELECT locationID, climate, temperature FROM GuideClimates';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfClimates(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.climates = results;
          //pass it to handlebars to put inside a file
          res.render('climates', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfClimates())

        //res.send('Here you go!');
    }

    function serveOneClimate(chicken, steak) {
      console.log(chicken.params.fancyId);
      console.log(chicken.params);
      fancyId = chicken.params.fancyId

      var queryString = "SELECT locationID, climate, temperature FROM GuideClimates WHERE locationID = ?"

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOneGuide(error, results, fields){
          console.log("results are " + results)
          context.guides = results[0]
          console.log(context)

          if(error){
            console.log(error)
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverClimate',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOneGuide());

      //steak.send("Here's a good tasty well done steak");
    }

    router.get('/', serveClimates);
    router.get('/:fancyId', serveOneClimate);
    return router;
}();
