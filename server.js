var express = require('express');
var app = express();
var fs = require('fs');
var bcrypt = require('bcryptjs');
var session = require('express-session');
app.use(session({
    secret: 'Any Secret - I dont know',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));

// set hostname and port here
var hostname = 'localhost';
var port = 9090;

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
var courses = require('./courses');
var admin = require('./admin');

var common = require('./common');
var sendBackJSON = common.sendBackJSON;
var db = common.db;
var checkAuthentication = common.checkAuthentication;
var getLoggedInUserId = common.getLoggedInUserId;
var userIsLoggedIn = common.userIsLoggedIn;

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
        loggedIn: userIsLoggedIn(req),
    });
});

app.get('/profile', checkAuthentication, function (req, res) {
    user.renderProfilePage(req, res, getLoggedInUserId(req));
});

app.get('/profile/:id', checkAuthentication, function (req, res) {
    user.renderProfilePage(req, res, req.params.id);
});
    
app.get('/demo', function (req, res) {
    db.query('SELECT COUNT(*) AS userCount FROM USERS').spread(function (results, metadata) {
        res.render('demo', {
            userCount: results[0].userCount,
            leggedIn: userIsLoggedIn(req),
            demo: true
        });

    });
});

app.get('/course/:id', 
    courses.get_class_info, 
    courses.get_course_rating, 
    courses.get_enrolled_students, 
    courses.get_reviews,
    courses.render_course_page);


//for testing authentication puropse
app.get('/content', checkAuthentication, function (req, res) {
    res.send("You can only see this after you've logged in.");
});

app.get('/text', function (req, res) {
    var index = common.currentUser.indexOf('broke');
    if (index != -1) {
        common.currentUser.splice(index, 1);
        console.log("broke");
    }
});

/* Users ------------------------------------------------------------*/
/*app.get('/enroll', function (req, res) {
    db.query("INSERT INTO CLASSES (id, class_name, instructor) VALUES (1, 'TESTCOURSE', 3)").spread(function (results, metadata) {
        db.query("INSERT INTO ENROLMENT (user_id, class_id) VALUES (18, 1)").spread(function (results, metadata) {
            console.log("JOIN 1");
        })
    });
    db.query("INSERT INTO CLASSES (id, class_name, instructor) VALUES (2, 'TESTCOURSE2', 3)").spread(function (results, metadata) {
        db.query("INSERT INTO ENROLMENT (user_id, class_id) VALUES (18, 2)").spread(function (results, metadata) {
            console.log("JOIN 2");
        })
    });
});*/

app.post('/user/signin', user.signinHandler);

app.post('/user/signup', user.signupHandler);

app.post('/user/changeprofilepic', checkAuthentication, user.changeProfilePicHandler);

app.post('/user/changename', checkAuthentication, user.changeNameHandler);

app.post('/user/changepassword', checkAuthentication, user.changePasswordHandler);

app.post('/user/follow', checkAuthentication, followings.followHandler);

app.delete('/user/unfollow', checkAuthentication, followings.unfollowHandler);

app.get('/user/profile', checkAuthentication, user.getProfileHandler);

app.post('/user/logout', user.logoutHandler);

app.delete('/user/unenrollClasses', user.unenrollHandler);


/* Courses  ---------------------------------------------------------*/

app.get('/courses/recommended', recommendations.userCourses);

app.get('/courses/popular', recommendations.popularCourses);


/* Admins  ----------------------------------------------------------*/

app.post('/admin/login', admin.handleLoginRequest);


/* Searches  --------------------------------------------------------*/

app.get('/messaging', checkAuthentication, messaging.renderPage);


/* Searches  --------------------------------------------------------*/

app.get('/search', searchEngine.handleSearch);


/* socket io --------------------------------------------------------*/

socketIO.on('connection', checkAuthentication, messaging.onConnection);


/* server start up --------------------------------------------------*/

server.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
  });