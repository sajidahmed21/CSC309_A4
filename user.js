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
var db = common.db;
var color = ['green_background', 'light_green_background', 'blue_background', 'yellow_background', 'orange_background', 'red_background'];

exports.changeNameHandler = function (req, res) {
    var changeName = req.body.changeName;
    var user_id = req.session.thisid;
    db.query("UPDATE USERS SET name = '" + changeName + "' WHERE id=" + user_id).spread(function (results, metadata) {
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
exports.changeProfilePicHandler = function (req, res) {
    var changeProfilepic = req.body.changeProfilepic;
    var user_id = req.body.user_id;
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
exports.changePasswordHandler = function (req, res) {
    bcrypt.hash(req.body.changePassword, 8, function (err, hashedPassword) {
        if (err) {
            console.log('failed to hash password:');
            console.log(err);

            sendBackJSON({
                "error": "server error"
            }, res);
            return;
        }

        var user_id = req.session.thisid;
        db.query("UPDATE LOGIN_CREDENTIALS SET password = '" + hashedPassword + "' WHERE user_id=" + user_id).spread(function (results, metadata) {
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
exports.unenrollHandler = function (req, res) {
    var user_id = req.session.thisid;
    var class_id = req.body.dropCourse_id;
    db.query("DELETE FROM ENROLMENT WHERE user_id=" + user_id + " AND class_id =" + class_id).spread(function (results, metadata) {
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
    })
};

/* Renders the profile for the user with the userId equal to profileUserId. */
exports.getProfileHandler = function (req, res, profileUserId) {
    console.log("GETPROFILE" + profileUserId);
    db.query("SELECT name, profile_picture_path FROM USERS WHERE id = '" + profileUserId + "'").spread(function (results, metadata) {
        var name = results[0].name;
        var background_color = results[0].profile_picture_path;
        if (color.indexOf(background_color) < 0)
            background_color = 'grey_background';
        var firstLetterProfile = name.charAt(0);
        if (firstLetterProfile >= 'a' && firstLetterProfile <= 'z')
            firstLetterProfile = firstLetterProfile.toUpperCase();
        db.query("SELECT CLASSES.id AS id, CLASSES.class_name AS class_name, USERS.name AS instructor FROM ENROLMENT, CLASSES, USERS WHERE USERS.id=CLASSES.instructor AND CLASSES.id=ENROLMENT.class_id AND ENROLMENT.user_id =" + profileUserId).spread(function (result, meta) {
            db.query("SELECT EXISTS(SELECT 1 FROM FOLLOWINGS WHERE follower =" + common.getLoggedInUserId(req) + " AND followee=" + profileUserId + " ) AS checkfollow;").spread(function (resultInner, metaInner) {
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
                    userIsOwner: profileUserId == common.getLoggedInUserId(req)
                });
                //            var returnJSON = {
                //                "status": "success",
                //                "data": {
                //                    "name": results[0].name,
                //                    "profile_picture_path": results[0].profile_picture_path,
                //                    "courses": result
                //                },
                //                "message": "Success for getting profile",
                //            }
                //            sendBackJSON(returnJSON, res);
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

exports.signinHandler = function (req, res) {
    var signinUsername = req.body.signinUsername;
    var signinPassword = req.body.signinPassword;
    db.query("SELECT user_id, password FROM LOGIN_CREDENTIALS WHERE username = '" + signinUsername + "'").spread(function (results, metadata) {
        var thisid = results[0].user_id;
        console.log(thisid);
        bcrypt.compare(signinPassword, results[0].password, function (err, result) {
            if (err || result === false) {
                console.log("Err in login");
                req.session.destroy();
                res.status(400);
                return res.render('home', {
                    errorContent: '<p><strong>Opps!</strong> Your username and password do not match!</p>',
                    loggedIn: false
                });
            } else {
                common.currentUser.push(signinUsername);
                req.session.user = signinUsername;
                req.session.alive = true;
                console.log(thisid);
                req.session.thisid = thisid;
                console.log(req.session.user);
                console.log("signinHandler " + req.session.thisid);
                setLoggedInUserId(req, results[0].user_id);
                var returnJSON = {
                    "status": "success",
                    "message": "Login Success"
                }
                sendBackJSON(returnJSON, res);
            }
        })
    }).catch(function (err) {
        res.status(400);
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> Your username and password do not match!</p>',
            loggedIn: false
        });
    });
};

exports.signupHandler = function (req, res) {
    if (req.body.signupPassword.length < 8) {
        res.status(400);
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> Your password must be at least length of 8!</p>',
            loggedIn: false
        });
    }
    if (req.body.signupPassword != req.body.userPasswordConfirm) {
        console.log("return");
        res.status(400);
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> Your password do not match!</p>',
            loggedIn: false
        });
    }
    bcrypt.hash(req.body.signupPassword, 8, function (err, hashedPassword) {
        if (err) {
            req.session.destroy();
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
                return db.query("INSERT INTO USERS (name, profile_picture_path) VALUES ('" + signupName + "','" + signupProfilePicture + "')", {
                    transaction: transaction
                }).then(function (result) {
                    var metadata = result[1];
                    return exports.loginInsert(transaction, metadata.lastID, signupUsername, hashedPassword, res, req);
                });
            })
            .catch(function (err) {
                req.session.destroy();
                console.log("failed to create user:");
                console.log(err);
                var returnJSON = {
                    "status": "error",
                    "message": "failed to create user"
                }
                sendUnauthorizedResponse(returnJSON, res);
            });
    });
};

exports.loginInsert = function (transaction, id, signupUsername, signupPassword, res, req) {
    return db.query("INSERT INTO LOGIN_CREDENTIALS (user_id, username, password) VALUES (" + id + ",'" + signupUsername + "','" + signupPassword + "')", {
            transaction: transaction
        })
        .then(function (result, metadata) {
            console.log("LOGININSERT" + id);
            common.currentUser.push(signupUsername);
            req.session.user = signupUsername;
            req.session.alive = true;
            req.session.thisid = id;
            // automatically log the user in
            setLoggedInUserId(req, id);

            var returnJSON = {
                "status": "success",
                "message": "Signup Success"
            };
            sendBackJSON(returnJSON, res);
        }).catch(function (err) {
            res.status(400);
            return res.render('home', {
                errorContent: '<p><strong>Opps!</strong> The username has been taken! Please choose another username!</p>',
                loggedIn: false
            });
        });
};

exports.logoutHandler = function (req, res) {
    var username = req.session.user;
    console.log(username);
    if (req.session && req.session.alive && (common.currentUser.indexOf(req.session.user) >= 0)) {
        console.log("INLOGGINOUT");
        var index = common.currentUser.indexOf(username);
        common.currentUser.splice(index, 1);
        setLoggedInUserId(req, 0);
        req.session.username = undefined;
        req.session.thisid = undefined;
        req.session.destroy();
        var returnJSON = {
            "status": "success",
            "message": "Logout Success"
        }
        sendBackJSON(returnJSON, res);
    } else {
        setLoggedInUserId(req, 0);
        req.session.username = undefined;
        req.session.thisid = undefined;
        req.session.destroy();
        var returnJSON = {
            "status": "error",
            "message": "Logout Error"
        }
        sendBackJSON(returnJSON, res);
    }
};

exports.deleteUserHandler = function (req, res) {
    var user_id = req.session.thisid;
    db.query("DELETE FROM LOGIN_CREDENTIALS WHERE user_id=" + user_id).spread(function (results, metadata) {
        db.query("DELETE FROM USERS WHERE id=" + user_id).spread(function (results, metadata) {
            setLoggedInUserId(req, 0);
            req.session.username = undefined;
            req.session.thisid = undefined;
            req.session.destroy();
            var returnJSON = {
                "status": "success",
                "message": "Delete Success"
            }
            sendBackJSON(returnJSON, res);
        }).catch(function (err) {
            setLoggedInUserId(req, 0);
            req.session.username = undefined;
            req.session.thisid = undefined;
            req.session.destroy();
            console.log("Err in delete course");
            var returnJSON = {
                "status": "error",
                "message": "Err in delete inner"
            }
            sendBackJSON(returnJSON, res);
        })
    }).catch(function (err) {
        setLoggedInUserId(req, 0);
        req.session.username = undefined;
        req.session.thisid = undefined;
        req.session.destroy();
        console.log("Err in delete course");
        var returnJSON = {
            "status": "error",
            "message": "Err in delete user outer"
        }
        sendBackJSON(returnJSON, res);
    })
};