var express = require('express');
var app = express();

var bcrypt = require('bcryptjs');
var session = require('express-session');
app.use(session({
    secret: 'Any Secret - I dont know',
    resave: true,
    saveUninitialized: true
}));


var bodyParser = require('body-parser');
app.use(bodyParser.json());

var server = require('http').Server(app);
var socketIO = require('socket.io')(server);
global.socketIO = socketIO;

var recommendations = require('./recommendations');
var messaging = require('./messaging');
var user = require('./user');
var followings = require('./followings');
var searchEngine = require('./searchEngine');

var admin = require('./admin');

var common = require('./common');
var sendBackJSON = common.sendBackJSON;
var db = common.db;
var checkAuthentication = common.checkAuthenticate;

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

app.get('/class/', function (req, res) {
    res.render('coursedesc', {
        loggedIn: false,
        imgPath: 'img/origami.jpg',
        courseTitle: 'Origami 101',
        instructor: 'JB',
        enrollment: 10,
        courseDesc: 'Learning about origami',
        courseRequirements: 'Paper',
        students: [
            {
                username: 'QW',
                name: 'Q W'
            },
            {
                username: 'TY',
                name: 'T Y'
            }
        ]
    });
});

//for testing authentication puropse
app.get('/content', checkAuthentication, function (req, res) {
    res.send("You can only see this after you've logged in.");
});

app.get('/text', function (res, req) {
    var index = common.currentUser.indexOf('broke');
    if (index != -1) {
        common.currentUser.splice(index, 1);
        console.log("broke");
    }
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


/* Searches  --------------------------------------------------------*/

app.get('/search', searchEngine.handleSearch);


/* socket io --------------------------------------------------------*/

socketIO.on('connection', messaging.onConnection);


/* server start up --------------------------------------------------*/

server.listen(9090, function () {
    console.log('listening on port 9090');
});