var express = require('express');
var app = express();

// database setup
var sequelize = require('sequelize')

function initialiseDatabase() {
  console.log('initialising db');
  return new sequelize('learnrDB', null, null, {
	  dialect: 'sqlite',
	  storage: __dirname + '/learnrDB.sqlite'
  });
}

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
	db.query('SELECT COUNT(*) AS userCount FROM USERS').spread(function(results, metadata) {
		res.render('demo', {
			userCount: results[0].userCount,
			leggedIn: false,
			demo: true
		});
		
	});
});


/* server start up --------------------------------------------------*/

var db = initialiseDatabase();

app.listen(9090, function () {
  console.log('listening on port 9090');
});