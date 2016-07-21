var express = require('express');
var app = express();

var bcrypt = require('bcryptjs');

var bodyParser = require('body-parser');
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
    bcrypt.hash(req.body.changePassword, 8, function(err, hashedPassword) {
        if (err) {
            console.log('failed to hash password:');
            console.log(err);
            
            sendBackJSON({"error": "server error"}, res);
            return;
        }
        
        var user_id = req.body.user_id;
        db.query("UPDATE LOGIN_CREDENTIALS SET password = '"+ hashedPassword +"' WHERE user_id=" + user_id).spread(function(results, metadata){
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
    db.query("SELECT password FROM LOGIN_CREDENTIALS WHERE username = '" + signinUsername + "'").spread(function (results, metadata) {
        bcrypt.compare(signinPassword, results[0].password, function(err, result) { 
            if (err || result === false) {
                console.log("Err in login");
                var returnJSON = {
                    "error": "Err in login"
                }
                sendBackJSON(returnJSON, res);
            }
            else {
                var returnJSON = {
                    "success": "Login Success"
                }
                sendBackJSON(returnJSON, res);
            }
        })
    }).catch(function (err) {
        console.log("Err in signin");
        var returnJSON = {
            "error": "Err in login"
        }
        sendBackJSON(returnJSON, res);
    });
}

var signupHandler = function (req, res) {
    bcrypt.hash(req.body.signupPassword, 8, function(err, hashedPassword) {
        if (err) {
            console.log('failed to hash password:');
            console.log(err);
            
            sendBackJSON({"error": "server error"}, res);
            return;
        }
        
        console.log("ab")
        console.log(req.body);
        
        db.transaction(function (transaction) {
    
            var signupName = req.body.signupName;
            var signupUsername = req.body.signupUsername;
            var signupProfilePicture = req.body.signupProfilePicture;
            return db.query("INSERT INTO USERS (name, profile_picture_path) VALUES ('" + signupName + "','" + signupProfilePicture + "')", {transaction: transaction}).then(function (result) {
                var metadata = result[1];
                return loginInsert(transaction, metadata.lastID, signupUsername, hashedPassword, res);
            });
        })
        .catch(function(err) {
            console.log("failed to create user:");
            console.log(err);
            
            sendBackJSON({"error": "failed to create user"}, res);
        });
    });
};

var loginInsert = function (transaction, id, signupUsername, signupPassword, res) {
    return db.query("INSERT INTO LOGIN_CREDENTIALS (user_id, username, password) VALUES (" + id + ",'" + signupUsername + "','" + signupPassword + "')", {transaction: transaction})
    .then(function (result, metadata) {
        var returnJSON = {
            "success": "Signup Success"
        };
        sendBackJSON(returnJSON, res);
    });
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