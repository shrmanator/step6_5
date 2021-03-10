var express = require('express');
var app = express();
var handlebars = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // public folder is static

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

// Routes
app.use('/guides', require('./guides.js'));
app.use('/climates', require('./climates.js'));
app.use('/add-guide', require('./guides.js'));
app.use('/update-guide', require('./update-guide.js'));
app.use('/guides_certs', require('./guides_certs.js'));
app.use('/', require('./guides.js')); // default route

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log(
    `Express started on http://localhost:${app.get('port')} press Ctrl-C to terminate.`);
});
