var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

/*app.get('/check', function (req, res) {
    db.query('SELECT * FROM USERS').spread(function (results, metadata) {
        console.log(results);
        res.render('demo', {
            userCount: results[0].userCount,
            leggedIn: false,
            demo: true
        });

    });
});
app.get('/checkk', function (req, res) {
    db.query('SELECT * FROM FOLLOWINGS').spread(function (results, metadata) {
        console.log(results);
        res.render('demo', {
            //userCount: results[0].userCount,
            leggedIn: false,
            demo: true
        });

    });
});

app.get('/enrolls', function (req, res) {
    db.query("INSERT INTO ENROLMENT (user_id, class_id) VALUES (5, 1)").spread(function (results, metadata) {
        console.log("JOIN 1");
    });
    db.query("INSERT INTO ENROLMENT (user_id, class_id) VALUES (5, 2)").spread(function (results, metadata) {
        console.log("JOIN 2");
    });
});
app.get('/enroll', function (req, res) {
    db.query("INSERT INTO CLASSES (id, class_name, instructor) VALUES (1, 'TESTCOURSE', 3)").spread(function (results, metadata) {
        db.query("INESRT INTO ENROLMENT (user_id, class_id) VALUES (5, 1)").spread(function (results, metadata) {
            console.log("JOIN 1");
        })
    });
    db.query("INSERT INTO CLASSES (id, class_name, instructor) VALUES (2, 'TESTCOURSE2', 3)").spread(function (results, metadata) {
        db.query("INESRT INTO ENROLMENT (user_id, class_id) VALUES (5, 2)").spread(function (results, metadata) {
            console.log("JOIN 2");
        })
    });
});*/

var followHandler = function (req, res){
    var follower = req.body.follower;
    var followee = req.body.followee;
    db.query("INSERT INTO FOLLOWINGS (follower,followee ) VALUES (" + follower +"," + followee + ")" ).spread(function(results, metadata){
        var returnJSON = {
            "success": "Success in following"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in follow");
        var returnJSON = {
            "error": "Err in follow"
        }
        sendBackJSON(returnJSON, res);
    });
};

var unfollowHandler = function (req, res){
    var follower = req.body.follower;
    var followee = req.body.followee;
    db.query("DELETE FROM FOLLOWINGS WHERE follower =" + follower +" AND followee = " + followee ).spread(function(results, metadata){
        var returnJSON = {
            "success": "Success in unfollowing"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in unfollow");
        var returnJSON = {
            "error": "Err in unfollow"
        }
        sendBackJSON(returnJSON, res);
    });
}

var changeNameHandler = function (req, res) {
    var changeName = req.body.changeName;
    var user_id = req.body.user_id;
    db.query("UPDATE USERS SET name = '"+changeName+"' WHERE id=" + user_id).spread(function(results, metadata){
        var returnJSON = {
            "success": "Change Name Success"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in change name");
        var returnJSON = {
            "error": "Err in change name"
        }
        sendBackJSON(returnJSON, res);
    });
};
var changeProfilePicHandler = function(req, res){
    var changeProfilepic = req.body.changeProfilepic;
    var user_id = req.body.user_id;
    db.query("UPDATE USERS SET profile_picture_path = '"+changeProfilepic+"' WHERE id=" + user_id).spread(function(results, metadata){
        var returnJSON = {
            "success": "Change Profile Pic Success"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in change profile pic");
        var returnJSON = {
            "error": "Err in change profile pic"
        }
        sendBackJSON(returnJSON, res);
    });
};
var changePasswordHandler = function (req, res){
    var changePassword = req.body.changePassword;
    var user_id = req.body.user_id;
    db.query("UPDATE LOGIN_CREDENTIALS SET password_hash = '"+changePassword+"' WHERE user_id=" + user_id).spread(function(results, metadata){
        var returnJSON = {
            "success": "Change Password Success"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in change password");
        var returnJSON = {
            "error": "Err in change password"
        }
        sendBackJSON(returnJSON, res);
    });
};
var unenrollHandler = function (req, res){
    var user_id = req.param('user_id');
    var class_id = req.param('class_id');
    db.query("DELETE FROM ENROLMENT WHERE user_id=" + user_id + " AND class_id =" + class_id).spread(function(results, metadata){
        var returnJSON = {
            "success": "Delete Success"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function (err){
        console.log("Err in delete course");
        var returnJSON = {
            "error": "Err in delete course"
        }
        sendBackJSON(returnJSON, res);
    })
};
var getProfileHandler = function(req, res){
    var id = req.param('user_id');
    db.query("SELECT name, profile_picture_path FROM USERS WHERE id = '" + id + "'").spread(function (results, metadata) {
        db.query("SELECT id, class_name FROM ENROLMENT, CLASSES WHERE id=class_id AND user_id =" + id).spread(function (result, meta) {
            console.log(result);
            
            var returnJSON = {
                "name": results[0].name,
                "profile_picture_path": results[0].profile_picture_path,
                "courses": result
            }
            sendBackJSON(returnJSON, res);
        })

    }).catch(function (err) {
        console.log("Err in getting user profile");
        var returnJSON = {
            "error": "Err in getting user profile"
        }
        sendBackJSON(returnJSON, res);
    });
};

var signinHandler = function (req, res) {
    var signinUsername = req.body.signinUsername;
    var signinPassword = req.body.signinPassword;
    db.query("SELECT password_hash, password_salt FROM LOGIN_CREDENTIALS WHERE username = '" + signinUsername + "'").spread(function (results, metadata) {
        if (results[0].password_hash == signinPassword) {
            var returnJSON = {
                "success": "Login Success"
            }
            sendBackJSON(returnJSON, res);
        } else {
            console.log("Err in login");
            var returnJSON = {
                "error": "Err in login"
            }
            sendBackJSON(returnJSON, res);
        }
    }).catch(function (err) {
        console.log("Err in signin");
        var returnJSON = {
            "error": "Err in login"
        }
        sendBackJSON(returnJSON, res);
    });
}

var signupHandler = function (req, res) {
    db.query('SELECT COUNT(*) AS userCount FROM USERS').spread(function (results, metadata) {
        console.log("ab")
        console.log(req.body);
        var id = results[0].userCount + 1;
        var signupName = req.body.signupName;
        var signupUsername = req.body.signupUsername;
        var signupPassword = req.body.signupPassword;
        var signupProfilePicture = req.body.signupProfilePicture;
        var signupSalt = randomGenSalt();
        db.query("INSERT INTO USERS (id, name, profile_picture_path) VALUES (" + id + ",'" + signupName + "','" + signupProfilePicture + "')").spread(function (result, metadata) {
            loginInsert(id, signupUsername, signupPassword, signupSalt, res);
        }).catch(function (err) {
            console.log("Err in insert USERS");
            var returnJSON = {
                "error": "Err in insert USERS"
            }
            sendBackJSON(returnJSON, res);
        });
    });
};

var loginInsert = function (id, signupUsername, signupPassword, signupSalt, res) {
    db.query("INSERT INTO LOGIN_CREDENTIALS (user_id, username, password_hash, password_salt) VALUES (" + id + ",'" + signupUsername + "','" + signupPassword + "','" + signupSalt + "')").spread(
            function (result, metadata) {
                var returnJSON = {
                    "success": "Signup Success"
                };
                sendBackJSON(returnJSON, res);
            })
        .catch(function (err) {
            console.log("Err in insert LOGIN_CREDENTIALS");
            var returnJSON = {
                "error": "Err in insert LOGIN_CREDENTIALS"
            }
            sendBackJSON(returnJSON, res);
        });
};

var randomGenSalt = function () {
    var randomText = "";
    var charInclude = "abcdefghijklmnopqustuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    for (var i = 0; i < 32; i++) {
        randomText = randomText + charInclude.charAt(Math.floor(Math.random() * charInclude.length));
    }
    return randomText;
};

var sendBackJSON = function (retJSON, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    });
    res.write(JSON.stringify(retJSON));
    res.end();
};
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

app.post('/user/signin', function (req, res) {
    signinHandler(req, res);
});
app.post('/user/signup', function (req, res) {
    signupHandler(req, res);
});
app.post('/user/changeprofilepic', function(req, res){
    changeProfilePicHandler(req, res);
});
app.post('/user/changename', function(req, res){
    changeNameHandler(req, res);
});
app.post('/user/changepassword', function (req, res){
    changePasswordHandler(req, res);
});
app.post('/user/follow', function (req, res){
    followHandler(req, res);
});
app.delete('/user/unfollow', function (req, res){
    unfollowHandler(req, res);
});
app.get('/user/profile', function (req, res) {
    getProfileHandler(req,res);
});
app.delete('/user/course', function(req, res) {
    unenrollHandler(req, res);
});



/* server start up --------------------------------------------------*/

var db = initialiseDatabase();

app.listen(9090, function () {
    console.log('listening on port 9090');
});