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
var common = require('./common');
var bcrypt = require('bcryptjs');
var sendBackJSON = common.sendBackJSON;
var setLoggedInUserId = common.setLoggedInUserId;
var db = common.db;

exports.changeNameHandler = function (req, res) {
    var changeName = req.body.changeName;
    var user_id = req.body.user_id;
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

        var user_id = req.body.user_id;
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
    var user_id = req.param('user_id');
    var class_id = req.param('class_id');
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

exports.getProfileHandler = function (req, res) {
    var id = req.param('user_id');
    db.query("SELECT name, profile_picture_path FROM USERS WHERE id = '" + id + "'").spread(function (results, metadata) {
        db.query("SELECT id, class_name FROM ENROLMENT, CLASSES WHERE id=class_id AND user_id =" + id).spread(function (result, meta) {
            console.log(result);

            var returnJSON = {
                "status": "success",
                "data": {
                    "name": results[0].name,
                    "profile_picture_path": results[0].profile_picture_path,
                    "courses": result
                },
                "message": "Success for getting profile",
            }
            sendBackJSON(returnJSON, res);
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
    db.query("SELECT password, user_id FROM LOGIN_CREDENTIALS WHERE username = '" + signinUsername + "'").spread(function (results, metadata) {
        bcrypt.compare(signinPassword, results[0].password, function (err, result) {
            if (err || result === false) {
                console.log("Err in login");
                req.session.destroy();
                var returnJSON = {
                    "status": "error",
                    "message": "Err in login"
                }
                sendBackJSON(returnJSON, res);
            } else {
                setLoggedInUserId(req, results[0].user_id);
                var returnJSON = {
                    "status": "success",
                    "message": "Login Success"
                }
                sendBackJSON(returnJSON, res);
            }
        })
    }).catch(function (err) {
        console.log("Err in signin");
        var returnJSON = {
            "status": "error",
            "message": "Err in login"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.signupHandler = function (req, res) {
    bcrypt.hash(req.body.signupPassword, 8, function (err, hashedPassword) {
        if (err) {
            req.session.destroy();
            console.log('failed to hash password:');
            console.log(err);

            sendBackJSON({
                "error": "server error"
            }, res);
            return;
        }

        console.log("ab")
        console.log(req.body);

        db.transaction(function (transaction) {

                var signupName = req.body.signupName;
                var signupUsername = req.body.signupUsername;
                var signupProfilePicture = req.body.signupProfilePicture;
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
                sendBackJSON(returnJSON, res);
            });
    });
};

exports.loginInsert = function (transaction, id, signupUsername, signupPassword, res, req) {
    return db.query("INSERT INTO LOGIN_CREDENTIALS (user_id, username, password) VALUES (" + id + ",'" + signupUsername + "','" + signupPassword + "')", {
            transaction: transaction
        })
        .then(function (result, metadata) {
            // automatically log the user in
            setLoggedInUserId(req, id);

            var returnJSON = {
                "status": "success",
                "message": "Signup Success"
            };
            sendBackJSON(returnJSON, res);
        });
};

exports.logoutHandler = function (req, res) {
    var username = req.session.user;
    console.log(username);
    if (req.session && req.session.alive && (common.currentUser.indexOf(req.session.user) >= 0)) {
        console.log("INLOGGINOUT");
        var index = common.currentUser.indexOf(username);
        common.currentUser.splice(index, 1);
        req.session.destroy();
        var returnJSON = {
            "status": "success",
            "message": "Logout Success"
        }
        sendBackJSON(returnJSON, res);
    } else {
        req.session.destroy();
        var returnJSON = {
            "status": "error",
            "message": "Logout Error"
        }
        sendBackJSON(returnJSON, res);
    }
}