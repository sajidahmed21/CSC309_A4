var express = require('express');
var app = express();

// handlebars setup
var exphbs  = require('express-handlebars');
var hbs = exphbs.create({
	defaultLayout: false
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// set public directory for css, js, and imgs
app.use(express.static('public'));


/* page routing -----------------------------------------------------*/
app.get('/', function (req, res) {
	res.render('home', {
		loggedIn: true
	});
});


app.get('/demo', function (req, res) {
	res.render('demo', {
		leggedIn: false,
		demo: true
	});
});


/* server start up --------------------------------------------------*/
app.listen(9090, function () {
  console.log('listening on port 9090');
});