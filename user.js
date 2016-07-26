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
var common = require('./common');
var bcrypt = require('bcryptjs');
var sendBackJSON = common.sendBackJSON;
var sendUnauthorizedResponse = common.sendUnauthorizedResponse;
var setLoggedInUserId = common.setLoggedInUserId;
var getLoggedInUserId = common.getLoggedInUserId;
var db = common.db;
var color = ['green_background', 'light_green_background', 'blue_background', 'yellow_background', 'orange_background', 'red_background'];

exports.test = {};
//function for change user name
var changeNameHandler = function (req, res) {
    var changeName = req.body.changeName;
    var user_id = getLoggedInUserId(req);
    db.query("UPDATE USERS SET name = $1 WHERE id= $2", {
        bind: [changeName, user_id]
    }).spread(function (results, metadata) {
        var returnJSON = {
            "status": "success",
            "message": "Change Name Success"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function (err) {
        console.log("Err in change name");
        var returnJSON = {
            "status": "error",
            "message": "Err in change name"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.changeNameHandler = changeNameHandler;
exports.test.changeNameHandler = changeNameHandler;
//function for change profile picture
var changeProfilePicHandler = function (req, res) {
    var changeProfilepic = req.body.changeProfilepic;
    var user_id = getLoggedInUserId(req);
    db.query("UPDATE USERS SET profile_picture_path = '" + changeProfilepic + "' WHERE id=" + user_id).spread(function (results, metadata) {
        var returnJSON = {
            "status": "success",
            "message": "Change Profile Pic Success"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function (err) {
        console.log("Err in change profile pic");
        var returnJSON = {
            "status": "error",
            "message": "Err in change profile pic"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.changeProfilePicHandler = changeProfilePicHandler;
exports.test.changeProfilePicHandler = changeProfilePicHandler;

//function for change password
var changePasswordHandler = function (req, res) {
    bcrypt.hash(req.body.changePassword, 8, function (err, hashedPassword) {
        if (err) {
            console.log('failed to hash password:');
            console.log(err);

            sendBackJSON({
                "error": "server error"
            }, res);
            return;
        }

        var user_id = getLoggedInUserId(req);
        db.query("UPDATE LOGIN_CREDENTIALS SET password = $1 WHERE user_id= $2", {
            bind: [hashedPassword, user_id]
        }).spread(function (results, metadata) {
            var returnJSON = {
                "status": "success",
                "message": "Change Password Success"
            }
            sendBackJSON(returnJSON, res);
        }).catch(function (err) {
            console.log("Err in change password");
            var returnJSON = {
                "status": "error",
                "message": "Err in change password"
            }
            sendBackJSON(returnJSON, res);
        });
    });
};

exports.changePasswordHandler = changePasswordHandler;
exports.test.changePasswordHandler = changePasswordHandler;

//function for unenroll class
var unenrollHandler = function (req, res) {
    var user_id = getLoggedInUserId(req);
    var class_id = req.body.dropCourse_id;
    db.query("DELETE FROM ENROLMENT WHERE user_id= $1 AND class_id = $2",{
        bind: [user_id, class_id]
    }).spread(function (results, metadata) {
        var returnJSON = {
            "status": "success",
            "message": "Delete Success"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function (err) {
        console.log("Err in delete course");
        var returnJSON = {
            "status": "error",
            "message": "Err in delete course"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.unenrollHandler = unenrollHandler;
exports.test.unenrollHandler = unenrollHandler;

/* Renders the profile for the user with the userId equal to profileUserId. */
var getProfileHandler = function (req, res, profileUserId) {
    console.log("GETPROFILE" + profileUserId);
    console.log(common.getLoggedInUserId(req));
    db.query("SELECT name, profile_picture_path FROM USERS WHERE id = $1",{
        bind: [profileUserId]
    }).spread(function (results, metadata) {
        var name = results[0].name;
        var background_color = results[0].profile_picture_path;
        if (color.indexOf(background_color) < 0)
            background_color = 'grey_background';
        var firstLetterProfile = name.charAt(0);
        if (firstLetterProfile >= 'a' && firstLetterProfile <= 'z')
            firstLetterProfile = firstLetterProfile.toUpperCase();
        console.log('HERREEEEEE');
        db.query("SELECT CLASSES.id AS id, CLASSES.class_name AS class_name, USERS.name AS instructor FROM ENROLMENT, CLASSES, USERS WHERE USERS.id=CLASSES.instructor AND CLASSES.id=ENROLMENT.class_id AND ENROLMENT.user_id = $1",{
            bind: [profileUserId]
        }).spread(function (result, meta) {
            db.query("SELECT EXISTS(SELECT 1 FROM FOLLOWINGS WHERE follower = $1 AND followee= $2 ) AS checkfollow",{
                bind:[getLoggedInUserId(req), profileUserId]
            }).spread(function (resultInner, metaInner) {
                var boolFollow = false;
                if (resultInner[0]['checkfollow'] == 1)
                    boolFollow = true;
                console.log(result);
                res.render('profile', {
                    profile_name: firstLetterProfile,
                    background_color: background_color,
                    name: name,
                    classes: result,
                    loggedIn: common.userIsLoggedIn(req),
                    current_id: profileUserId,
                    followed: boolFollow,
                    userIsOwner: profileUserId == getLoggedInUserId(req)
                });
            })
        })

    }).catch(function (err) {
        console.log("Err in getting user profile");
        var returnJSON = {
            "status": "error",
            "message": "Err in getting user profile"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.getProfileHandler = getProfileHandler;
exports.test.getProfileHandler = getProfileHandler;

//function for login 
var signinHandler = function (req, res, testing) {
    var signinUsername = req.body.signinUsername;
    var signinPassword = req.body.signinPassword;
    db.query("SELECT user_id, password FROM LOGIN_CREDENTIALS WHERE username = $1",{
        bind: [signinUsername]
    }).spread(function (results, metadata) {
        var thisid = results[0].user_id;
        console.log(thisid);
        bcrypt.compare(signinPassword, results[0].password, function (err, result) {
            if (err || result === false) {
                console.log("Err in login");
                res.status(401);
                return res.render('home', {
                    errorContent: '<p><strong>Opps!</strong> Your username and password do not match!</p>',
                    loggedIn: false
                });
            } else {
                if(testing != undefined)
                    return testing(true);
                console.log("signinHandler " + results[0].user_id);
                setLoggedInUserId(req, results[0].user_id);
                exports.getProfileHandler(req, res, results[0].user_id);
            }
        })
    }).catch(function (err) {
        res.status(401);
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> Your username and password do not match!</p>',
            loggedIn: false
        });
    });
};

exports.signinHandler = signinHandler;
exports.test.signinHandler = signinHandler;

//function for sign up
var signupHandler = function (req, res) {
    if (req.body.signupPassword.length < 8) {
        res.status(401);
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> Your password must be at least length of 8!</p>',
            loggedIn: false
        });
    }
    if (req.body.signupPassword != req.body.userPasswordConfirm) {
        console.log("return");
        res.status(401);
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> Your password do not match!</p>',
            loggedIn: false
        });
    }
    bcrypt.hash(req.body.signupPassword, 8, function (err, hashedPassword) {
        if (err) {
            console.log('failed to hash password:');
            console.log(err);

            sendUnauthorizedResponse({
                "error": "server error"
            }, res);
            return;
        }

        console.log("ab")
        console.log(req.body);

        db.transaction(function (transaction) {
                var signupName = req.body.signupName;
                var signupUsername = req.body.signupUsername;
                var signupProfilePicture = color[Math.floor(Math.random() * 5)];
                return db.query("INSERT INTO USERS (name, profile_picture_path) VALUES ( $1 , $2 )", {
                    transaction: transaction,
                    bind: [signupName, signupProfilePicture]
                }).then(function (result) {
                    var metadata = result[1];
                    return exports.loginInsert(transaction, metadata.lastID, signupUsername, hashedPassword, res, req);
                });
            })
            .catch(function (err) {
                res.status(401);
                return res.render('home', {
                    errorContent: '<p><strong>Opps!</strong> The username has been taken! Please choose another username!</p>',
                    loggedIn: false
                });
            });
    });
};

exports.signupHandler = signupHandler;
exports.test.signupHandler = signupHandler;

//function for sign up insert into login_credentials table
var loginInsert = function (transaction, id, signupUsername, signupPassword, res, req) {
    return db.query("INSERT INTO LOGIN_CREDENTIALS (user_id, username, password) VALUES ( $1 , $2 , $3 )", {
            transaction: transaction,
            bind: [id, signupUsername, signupPassword]
        })
        .then(function (result, metadata) {
            console.log("LOGININSERT" + id);
            // automatically log the user in
            setLoggedInUserId(req, id);
            exports.getProfileHandler(req, res, getLoggedInUserId(req));
//            var returnJSON = {
//                "status": "success",
//                "message": "Signup Success"
//            };
//            sendBackJSON(returnJSON, res);
        }).catch(function (err) {
            res.status(401);
            return res.render('home', {
                errorContent: '<p><strong>Opps!</strong> The username has been taken! Please choose another username!</p>',
                loggedIn: false
            });
        });
};

exports.loginInsert = loginInsert;
exports.test.loginInsert = loginInsert;

//function for logout 
var logoutHandler = function (req, res) {
    // if a user is logged in, logout and return
    if (getLoggedInUserId(req) != 0) {
        setLoggedInUserId(req, 0);
        console.log("INLOGGINOUT");
        var returnJSON = {
            "status": "success",
            "message": "Logout Success"
        }
        sendBackJSON(returnJSON, res);
    }
    // otherwise return an error
    else {
        setLoggedInUserId(req, 0);
        var returnJSON = {
            "status": "error",
            "message": "Logout Error"
        }
        sendBackJSON(returnJSON, res);
    }
};

exports.logoutHandler = logoutHandler;
exports.test.logoutHandler = logoutHandler;

//CASCADE ALL USERS and CLASSES
var deleteUserHandler = function (req, res) {
    var user_id = getLoggedInUserId(req);
    // always set the user_id to logged out
    setLoggedInUserId(req, 0);

    db.query("DELETE FROM LOGIN_CREDENTIALS WHERE user_id=" + user_id).spread(function (results, metadata) {
        db.query("DELETE FROM USERS WHERE id=" + user_id).spread(function (results, metadata) {
            var returnJSON = {
                "status": "success",
                "message": "Delete Success"
            }
            sendBackJSON(returnJSON, res);
        }).catch(function (err) {
            console.log("Err in deleting user");
            var returnJSON = {
                "status": "error",
                "message": "Err in delete inner"
            }
            sendBackJSON(returnJSON, res);
        });
    }).catch(function (err) {
        console.log("Err in delete course");
        var returnJSON = {
            "status": "error",
            "message": "Err in delete user outer"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.deleteUserHandler = deleteUserHandler;
exports.test.deleteUserHandler = deleteUserHandler;