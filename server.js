var express = require('express');
var app = express();

// security
var ddosModule = require('ddos')
// allow 160 requests per minute, with no more than 12 at a given time
var ddos = new ddosModule({
    limit: 160,
    burst: 12,
    maxexpiry: 60,
    errormessage: 'Oh no! You\'ve been making too many requests and have been blocked.',
});
app.use(ddos.express)

var bcrypt = require('bcryptjs');

// other modules
var fs = require('fs');

// socket.io for messaging
var server = require('http').Server(app);
var socketIO = require('socket.io')(server);
global.socketIO = socketIO;


// shared session management between regular requests and socket.io ones
var session = require('express-session')({
    secret: 'Any Secret - I dont know',
    resave: true,
    saveUninitialized: true,
    rolling: true
});
var sharedSession = require("express-socket.io-session");

app.use(session);


socketIO.use(sharedSession(session, {
    secret: 'Any Secret - I dont know',
    resave: true,
    saveUninitialized: true
}));


// set hostname and port here
var hostname = 'localhost';
var port = 9090;
var expressValidator = require('express-validator')
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });// for parsing multipart/form-data

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// custom modules
var recommendations = require('./recommendations');
var messaging = require('./messaging');
var user = require('./user');
var followings = require('./followings');
var searchEngine = require('./searchEngine');
var courses = require('./courses');
var admin = require('./admin');
var createcourse = require('./createcourse');
var renderHome = require('./home').render;

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
app.get('/', renderHome);


/* Courses ----------------------------------------------------------*/

app.get('/course/:id',
    courses.get_class_info,
    courses.get_course_rating,
    courses.get_enrolled_students,
    courses.get_reviews,
    courses.render_course_page);

app.get('/createcourse', function(req, res) {
    userIsLoggedIn(req);
    // if logged in render page 
    // otherwise display page that says the user must be signed in to create a course. 
        res.render('createcourse', {
            loggedIn:  true,
            courseBannerErr: '', 
            courseReqs: '',
            courseDesc: '', 
            courseTitle: '',
        });
});

var upload = multer({dest: 'public/img/'}).single('courseBanner');
app.post('/createcourse', function(req, res, next) {
    upload(req, res, function (err) { 
            res.courseBannerErr = '';
            res.courseTitleErr = '';
            if (err) {
                console.log("something went wrong with file upload");
                return;
            } else {
                console.log(req.file);
                if (!req.file) // undefined, use default path 
                    res.bannerpath = "/img/study.jpg";
                else {
                    res.bannerpath = req.file.path;
                }
                        // replace 1 with id of logged in user
                        console.log("res.bannerpath in server: "+res.bannerpath);
                        next();
                        
            }
})
}, createcourse.validate, createcourse.addClassInfoAndRedirect);

//for testing authentication puropse
app.get('/content', checkAuthentication, function (req, res) {
    res.send("You can only see this after you've logged in.");
});


/* Users ------------------------------------------------------------*/

app.get('/enrolls', function (req, res) {
    db.query("INSERT INTO ENROLMENT (user_id, class_id) VALUES (18, 1)").spread(function (results, metadata) {
        console.log("JOIN 1");
    })
    db.query("INSERT INTO ENROLMENT (user_id, class_id) VALUES (18, 2)").spread(function (results, metadata) {
        console.log("JOIN 2");
    })
})
app.get('/enroll', function (req, res) {
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
});



app.post('/user/signin', user.signinHandler);

app.post('/user/signup', user.signupHandler);

app.post('/user/changeprofilepic', checkAuthentication, user.changeProfilePicHandler);

app.post('/user/changename', checkAuthentication, user.changeNameHandler);

app.post('/user/changepassword', checkAuthentication, user.changePasswordHandler);

app.post('/user/follow', checkAuthentication, followings.followHandler);

app.post('/user/unfollow', checkAuthentication, followings.unfollowHandler);

app.get('/user/profile', checkAuthentication, function (req, res) {
    user.getProfileHandler(req, res, getLoggedInUserId(req));
});

app.get('/user/profile/:id', checkAuthentication, function (req, res) {
    user.getProfileHandler(req, res, req.params.id);
});

app.post('/user/logout', user.logoutHandler);

app.post('/user/unenrollClasses', checkAuthentication, user.unenrollHandler);

app.post('/user/deleteuser', checkAuthentication, user.deleteUserHandler);


/* Admins  ----------------------------------------------------------*/

app.get('/admin', admin.checkAuthentication, admin.handleAdminHomeRequest);

app.post('/admin/login', admin.handleLoginRequest);


/* Searches  --------------------------------------------------------*/

app.get('/messaging', checkAuthentication, messaging.renderPage);


/* Searches  --------------------------------------------------------*/

app.get('/search', searchEngine.handleSearch);


/* socket io --------------------------------------------------------*/

socketIO.on('connection', messaging.onConnection);


/* server start up --------------------------------------------------*/

server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
