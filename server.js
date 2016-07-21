var express = require('express');
var app = express();

var bcrypt = require('bcryptjs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var server = require('http').Server(app);
var socketIO = require('socket.io')(server);
global.socketIO = socketIO;

var recommendations = require('./recommendations');
var messaging = require('./messaging');
var user = require('./user');
var followings = require('./followings');

var admin = require('./admin');

var common = require('./common');
var sendBackJSON = common.sendBackJSON;
var db = common.db;

// handlebars setup
var exphbs = require('express-handlebars');
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
    db.query('SELECT COUNT(*) AS userCount FROM USERS').spread(function (results, metadata) {
        res.render('demo', {
            userCount: results[0].userCount,
            leggedIn: false,
            demo: true
        });

    });
});

/* Users ------------------------------------------------------------*/

app.post('/user/signin', user.signinHandler);

app.post('/user/signup', user.signupHandler);

app.post('/user/changeprofilepic', user.changeProfilePicHandler);

app.post('/user/changename', user.changeNameHandler);

app.post('/user/changepassword', user.changePasswordHandler);

app.post('/user/follow', followings.followHandler);

app.delete('/user/unfollow', followings.unfollowHandler);

app.get('/user/profile', user.getProfileHandler);

app.delete('/user/course', user.unenrollHandler);


/* Courses  ---------------------------------------------------------*/

app.get('/courses/recommended', recommendations.userCourses);

app.get('/courses/popular', recommendations.popularCourses);


/* Admins  ----------------------------------------------------------*/

app.post('/admin/login', admin.handleLoginRequest);


/* socket io --------------------------------------------------------*/

socketIO.on('connection', messaging.onConnection);


/* server start up --------------------------------------------------*/

server.listen(9090, function () {
    console.log('listening on port 9090');
});