var common = require('./common');
var bcrypt = require('bcryptjs');

var sendBackJSON = common.sendBackJSON;
var setLoggedInUserId = common.setLoggedInUserId;
var getLoggedInUserId = common.getLoggedInUserId;
var db = common.db;
var color = ['green_background', 'light_green_background', 'blue_background', 'yellow_background', 'orange_background', 'red_background'];

exports.test = {};


/* Updates the name of a user with `userId` to `newName`.
 * Notifies about success / failure using the callback.
 */
exports.changeName = function (userId, newName, callback) {
    // Error checking
    if (userId === undefined || userId === 0) {
        callback('Invalid user id');
        return;
    }
    if (newName === undefined || newName.length === 0) {
        callback('Invalid name');
        return;
    }

    var updateQuery = 'UPDATE USERS SET name = $1 WHERE id = $2';
    db.query(updateQuery, {
        bind: [newName, userId]
    }).spread(function () {
        callback('Success');

    }).catch(function () {
        callback('Database error');
    });
};

exports.test.changeName = exports.changeName;

/* Handles name change requests from users by updating their name in the database
 * and responding with success / failure response.
 */
exports.changeNameHandler = function (request, response) {
    var userId = request.session.userId;
    var newName = request.body.changeName;

    exports.changeName(userId, newName, function (result) {
        var responseBody = {};

        console.log(result);
        if (result == 'Success') {
            responseBody = {
                "status": "success",
                "message": "Change Name Success"
            };
        } else {
            responseBody = {
                "status": "error",
                "message": "Err in change name"
            };
        }
        sendBackJSON(responseBody, response);
    });
};

exports.test.changeNameHandler = exports.changeNameHandler;

/* Changes the password for the user specified by `userId`. If `isAdminChanging` is true,
 * it doesn't verify the `currentPassword`. Otherwise, it only updates the password only after
 * verifying `currentPassword`.
 **/
exports.changePassword = function (userId, currentPassword, newPassword, newPasswordConfirm, isAdminChanging, callback) {
    // Error checking
    if (userId === undefined || userId === 0) {
        callback('Invalid user id');
        return;
    }
    if ((currentPassword === undefined || currentPassword.length < 8 || currentPassword.length > 20) && !isAdminChanging) {
        callback('Incorrect password');
        return;
    }
    if (newPassword === undefined || newPassword.length < 8 || newPassword > 20) {
        callback('Invalid new password');
        return;
    }

    if (newPasswordConfirm === undefined || newPasswordConfirm.length < 8 || newPasswordConfirm > 20) {
        callback('Invalid old password');
        return;
    }

    if (newPassword != newPasswordConfirm) {
        callback('Passwords do not match');
        return;
    }

    if (isAdminChanging) {
        // No need to verify current password if admin is changing the user's password
        updatePassword(userId, newPassword, callback);
    } else {
        // Otherwise first verify current password if user is themeselves changing their password
        verifyUserPassword(userId, currentPassword, function (result) {

            if (result == 'Valid') {
                updatePassword(userId, newPassword, callback);
            } else {
                callback('Incorrect password');
            }
        });
    }
};
exports.test.changePassword = exports.changePassword;

/* Handles change password requests from users by verifying and then updating their password. */
exports.changePasswordHandler = function (request, response) {
    var userId = request.session.userId;
    var currentPassword = request.body.currentPassword;
    var newPassword = request.body.changePassword;
    var newPasswordConfirm = request.body.newPasswordConfirm;


    exports.changePassword(userId, currentPassword, newPassword, newPasswordConfirm, false, function (result) {
        var responseBody = {};

        console.log(result);
        if (result == 'Success') {
            responseBody = {
                "status": "success",
                "message": "Change Password Success"
            };
        } else if (result == 'Incorrect password') {
            responseBody = {
                "status": "error",
                "message": "Incorrect Password"
            };
        } else {
            responseBody = {
                "status": "error",
                "message": result
            };
        }
        sendBackJSON(responseBody, response);
    });
};

exports.test.changePasswordHandler = exports.changePasswordHandler;


/* Updates the password in the database for the user specified by `userId` */
function updatePassword(userId, newPassword, callback) {
    var hashedPassword = common.generatePasswordHash(newPassword);

    db.query("UPDATE LOGIN_CREDENTIALS SET password = $1 WHERE user_id= $2", {
        bind: [hashedPassword, userId]

    }).spread(function () {
        callback('Success'); // Password successfully changed

    }).catch(function () {
        callback('Error');
    });
}

exports.test.updatePassword = updatePassword;

/* Verifies passwrod for the user specified by `userId`.
 * Notifies the result through the given callback function.
 */
function verifyUserPassword(userId, password, callback) {
    
    db.query('SELECT * FROM LOGIN_CREDENTIALS WHERE user_id = $1', {
        bind: [userId]
    }).spread(function (results) {
        if (results === undefined || results.length != 1) {
            callback('Error');
            return;
        }
        var currentPasswordHash = results[0].password;
        if (common.comparePassword(password, currentPasswordHash)) {
            callback('Valid');
        } else {
            callback('Invalid');
        }
    });
}

exports.test.verifyUserPassword = verifyUserPassword;

//function for change profile picture
var changeProfilePicHandler = function (req, res) {
    var changeProfilepic = req.body.changeProfilepic;
    var user_id = getLoggedInUserId(req);
    db.query("UPDATE USERS SET profile_color = '" + changeProfilepic + "' WHERE id=" + user_id).spread(function (results, metadata) {
        var returnJSON = {
            "status": "success",
            "message": "Change Profile Pic Success"
        };
        sendBackJSON(returnJSON, res);
    }).catch(function (err) {
        console.log("Err in change profile pic");
        var returnJSON = {
            "status": "error",
            "message": "Err in change profile pic"
        };
        sendBackJSON(returnJSON, res);
    });
};

exports.changeProfilePicHandler = changeProfilePicHandler;
exports.test.changeProfilePicHandler = changeProfilePicHandler;


exports.stopTeachingHelper = function (user_id, class_id, callback) {
    console.log("execute STOP TECHING");
    db.query("DELETE FROM CLASSES WHERE instructor= $1 AND id = $2", {
        bind: [user_id, class_id]
    }).spread(function (results, metadata) {
        callback('success');
    }).catch(function (err) {
        callback('error');
    });
};


//function for unenroll class
exports.stopTeachingHandler = function (req, res) {
    var user_id = getLoggedInUserId(req);
    var class_id = req.body.stopteachingCourse_id;
    exports.stopTeachingHelper(user_id, class_id, function (result) {
        if (result == 'success') {
            var returnJSON = {
                "status": "success",
                "message": "Delete Success"
            };
            sendBackJSON(returnJSON, res);
        } else if (result == 'error') {
            console.log("Err in delete course");
            var returnJSON = {
                "status": "error",
                "message": "Err in delete course"
            };
            sendBackJSON(returnJSON, res);
        }
    });
};


exports.unenrollUser = function (userId, classId, callback) {
    if (userId === undefined || userId < 1 || classId === undefined || classId < 1) {
        callback('Invalid input');
        return;
    }
    
    db.query("DELETE FROM ENROLMENT WHERE user_id= $1 AND class_id = $2", {
        bind: [userId, classId]
    }).spread(function () {
        callback('Success');
    }).catch(function () {
        callback('Error');
    });
};


exports.unenrollHandler = function (req, res) {
    var userId = getLoggedInUserId(req);
    var classId = req.body.dropCourse_id;
    
    exports.unenrollUser(userId, classId, function (result) {
        var responseBody = {};
        
        if (result == 'Success') {
            responseBody = {
                "status": "success",
                "message": "Delete Success"
            };
        } else if (result == 'Error') {
            console.log("Err in delete course");
            responseBody = {
                "status": "error",
                "message": "Err in delete course"
            };
        }
        sendBackJSON(responseBody, res);
    });
};

exports.test.unenrollHandler = exports.unenrollHandler;

/* Renders the profile for the user with the userId equal to profileUserId. */
var getProfileHandler = function (req, res, profileUserId) {
    console.log("GETPROFILE" + profileUserId);
    console.log(common.getLoggedInUserId(req));
    db.query("SELECT name, profile_color FROM USERS WHERE id = $1", {
        bind: [profileUserId]
    }).spread(function (results, metadata) {
        var name = results[0].name;
        var background_color = results[0].profile_color;
        if (color.indexOf(background_color) < 0)
            background_color = 'grey_background';
        var firstLetterProfile = name.charAt(0);
        if (firstLetterProfile >= 'a' && firstLetterProfile <= 'z')
            firstLetterProfile = firstLetterProfile.toUpperCase();
        console.log('HERREEEEEE');
        db.query("SELECT CLASSES.id AS id, CLASSES.class_name AS class_name, USERS.name AS instructor FROM ENROLMENT, CLASSES, USERS WHERE USERS.id=CLASSES.instructor AND CLASSES.id=ENROLMENT.class_id AND ENROLMENT.user_id = $1", {
            bind: [profileUserId]
        }).spread(function (result, meta) {
            db.query("SELECT EXISTS(SELECT 1 FROM FOLLOWINGS WHERE follower = $1 AND followee= $2 ) AS checkfollow", {
                bind: [getLoggedInUserId(req), profileUserId]
            }).spread(function (resultInner, metaInner) {
                var boolFollow = false;
                if (resultInner[0]['checkfollow'] == 1)
                    boolFollow = true;
                var classenroll = result;
                console.log(result);
                db.query("SELECT class_name, name AS instructor, CLASSES.id AS id FROM USERS, CLASSES WHERE USERS.id = $1 AND USERS.id = instructor", {
                    bind: [profileUserId]
                }).spread(function (classtaught, metadata) {
                    var classteaching = classtaught;
                    console.log(classteaching);
                    res.render('profile', {
                        profile_name: firstLetterProfile,
                        background_color: background_color,
                        name: name,
                        classes: classenroll,
                        classteaching: classteaching,
                        loggedIn: common.userIsLoggedIn(req),
                        current_id: profileUserId,
                        followed: boolFollow,
                        userIsOwner: profileUserId == getLoggedInUserId(req)
                    });
                });
            });
        });

    }).catch(function (err) {
        console.log("Err in getting user profile");
        var returnJSON = {
            "status": "error",
            "message": "Err in getting user profile"
        };
        sendBackJSON(returnJSON, res);
    });
};

exports.getProfileHandler = getProfileHandler;
exports.test.getProfileHandler = getProfileHandler;

//function for login 
var signinHandler = function (req, res, testing) {
    var signinUsername = req.body.signinUsername;
    var signinPassword = req.body.signinPassword;
    if (signinUsername == null || signinUsername == undefined || signinUsername == '' || signinPassword == null || signinPassword == undefined || signinPassword == '') {
        if (testing != undefined)
            return 'Missing Required Field!';
        else {
            res.status(401);
            return res.render('home', {
                errorContent: '<p><strong>Opps!</strong> Some of your required fields are missing!</p>',
                loggedIn: false
            });
        }
    }
    if (signinUsername.length < 8 || signinUsername.length > 20 || signinPassword.length < 8 || signinPassword.length > 20) {
        if (testing != undefined)
            return 'Too long / Too Short Username or Password';
        else {
            res.status(401);
            return res.render('home', {
                errorContent: '<p><strong>Opps!</strong> Your username and password must be at least 8 characters long and max 20 characters!</p>',
                loggedIn: false
            });
        }
    }
    db.query("SELECT user_id, password FROM LOGIN_CREDENTIALS WHERE username = $1", {
        bind: [signinUsername]
    }).spread(function (results, metadata) {
        var thisid = results[0].user_id;
        console.log(thisid);
        bcrypt.compare(signinPassword, results[0].password, function (err, result) {
            if (err || result === false) {
                if (testing != undefined)
                    return testing('Invalid Username and Password');
                else {
                    console.log("Err in login");
                    res.status(401);
                    return res.render('home', {
                        errorContent: '<p><strong>Opps!</strong> Your username and password do not match!</p>',
                        loggedIn: false
                    });
                }
            } else {
                if (testing != undefined)
                    return testing('true');
                console.log("signinHandler " + results[0].user_id);
                setLoggedInUserId(req, results[0].user_id);
                common.redirectToPage('/user/profile', res);
                return;
            }
        });
    }).catch(function (err) {
        if (testing != undefined)
            return testing('Invalid Username and Password');
        res.status(401);
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> Your username and password do not match!</p>',
            loggedIn: false
        });
    });
};

exports.signinHandler = signinHandler;
exports.test.signinHandler = signinHandler;


/* Handles sign up requests for new users by creating a new user account and then
 * rendering the profile page for the newly created user.
 */
exports.signupHandler = function (request, response) {
    var name = request.body.signupName;
    var username = request.body.signupUsername;
    var password = request.body.signupPassword;
    var passwordConfirmation = request.body.userPasswordConfirm;

    exports.createUser(name, username, password, passwordConfirmation, function (errorType, userId) {

        console.log(errorType);
        if (errorType === undefined) { // Success
            // Automatically log the user in
            setLoggedInUserId(request, userId);
            common.redirectToPage('/user/profile', res);
            return;
        }

        // Check error type and render web page with the appropriate message for the end user
        switch (errorType) {
        case 'Incorrect Username Length':
            response.status(401);
            return response.render('home', {
                errorContent: '<p><strong>Opps!</strong> Your username and password must be at least 8 characters long and max 20 characters!</p>',
                loggedIn: false
            });
        case 'Incorrect Password Length':
            response.status(401);
            return response.render('home', {
                errorContent: '<p><strong>Opps!</strong> Your username and password must be at least 8 characters long and max 20 characters!</p>',
                loggedIn: false
            });
        case 'Passwords Don\'t Match':
            response.status(401);
            return response.render('home', {
                errorContent: '<p><strong>Opps!</strong> Your password do not match!</p>',
                loggedIn: false
            });
        case 'Username Already Taken':
            response.status(401);
            return response.render('home', {
                errorContent: '<p><strong>Opps!</strong> The username has been taken! Please choose another username!</p>',
                loggedIn: false
            });
        case 'Required field missing':
            response.status(401);
            return response.render('home', {
                errorContent: '<p><strong>Opps!</strong> You have missed some required fields!</p>',
                loggedIn: false
            });
        }
    });
};

exports.test.signupHandler = exports.signupHandler;


/* Validates the name, username, password, passworedConfirmation and then creates
 * a new user account. Success / failure of the account creation is notified via
 * the provided callback.
 */
exports.createUser = function (name, username, password, passwordConfirmation, callback) {

    /* Error checking */
    if (name === undefined || name === '' || username === undefined || password === undefined) {
        callback('Required field missing');
        return;
    }

    if (password != passwordConfirmation) {
        callback('Passwords Don\'t Match');
        return;
    }

    if (username.length < 8 || username.length > 20) {
        callback('Incorrect Username Length');
        return;
    }

    if (password.length < 8 || password.length > 20) {
        callback('Incorrect Password Length');
        return;
    }

    var hashedPassword = common.generatePasswordHash(password);

    // Randomly select a profile picture color for newly joined user
    var signupProfilePicture = color[Math.floor(Math.random() * 5)];

    db.transaction(function (transactionObject) {
        // Insert into USERS table
        return db.query("INSERT INTO USERS (name, profile_color) VALUES ( $1 , $2 )", {
                transaction: transactionObject,
                bind: [name, signupProfilePicture]
            })
            .then(function (result) {
                var metadata = result[1];

                // Insert into LOGIN_CREDENTIALS table
                return db.query("INSERT INTO LOGIN_CREDENTIALS (user_id, username, password) VALUES ( $1 , $2 , $3 )", {
                    transaction: transactionObject,
                    bind: [metadata.lastID, username, hashedPassword]
                });
            });
    }).then(function (results) {
        // Transaction has been successfully committed
        var metadata = results[1];

        // Notify about succesful user creation to the caller
        callback(undefined, metadata.lastID);

    }).catch(function () {
        // Transaction has been rolled back
        // Notify caller about duplicate user name
        callback('Username Already Taken');
    });
};

exports.test.createUser = exports.createUser;

//function for logout 
var logoutHandler = function (req, res) {
    // if a user is logged in, logout and return
    if (getLoggedInUserId(req) != 0) {
        setLoggedInUserId(req, 0);
        console.log("INLOGGINOUT");
        var returnJSON = {
            "status": "success",
            "message": "Logout Success"
        };
        sendBackJSON(returnJSON, res);
    }
    // otherwise return an error
    else {
        setLoggedInUserId(req, 0);
        var returnJSON = {
            "status": "error",
            "message": "Logout Error"
        };
        sendBackJSON(returnJSON, res);
    }
};

exports.logoutHandler = logoutHandler;
exports.test.logoutHandler = logoutHandler;

exports.deleteUser = function (userId, callback) {
    if (userId === undefined || userId < 1 || userId === '') {
        callback('Invalid user id');
        return;
    }
    db.query("DELETE FROM LOGIN_CREDENTIALS WHERE user_id= $1", {
        bind: [userId]
        
    }).spread(function () {
        db.query("DELETE FROM USERS WHERE id= $1", {bind: [userId]}).spread(function () {
            callback('Success');
            
        }).catch(function () {
            callback('Error deleting user');
        });
        
    }).catch(function () {
        callback('Error deleting login credentials');
    });
};

//CASCADE ALL USERS and CLASSES
exports.deleteUserHandler = function (req, res) {
    var userId = getLoggedInUserId(req);
    // always set the userId to logged out since we are deleting the user
    setLoggedInUserId(req, 0);

    exports.deleteUser(userId, function (result) {
        var responseBody = {};
        if (result == 'Success') {
            responseBody = {
                "status": "success",
                "message": "Delete Success"
            };
            
        } else if (result == 'Error deleting user') {
            console.log("Err in deleting user");
            responseBody = {
                "status": "error",
                "message": "Err in delete inner"
            };

        } else if (result == 'Error deleting login credentials') {
            console.log("Err in deleting login credentials");
            responseBody = {
                "status": "error",
                "message": "Err in delete user outer"
            };

        }
        sendBackJSON(responseBody, res);
    });
};
exports.test.deleteUserHelper = exports.deleteUserHelper;
exports.test.deleteUserHandler = exports.deleteUserHandler;

/* Checks for error and returns the profile picture color for a user */
exports.getProfilePictureColor = function (backgroundColor) {
    if (backgroundColor === undefined || backgroundColor === null || color.indexOf(backgroundColor) < 0) {
        backgroundColor = 'grey_background';
    }
    return backgroundColor;
};

/* Returns the first letter of `name` in capital case for displaying in the user profile picture */
exports.getFirstLetterForProfile = function (name) {
    var firstLetterProfile = name.charAt(0);

    if (firstLetterProfile >= 'a' && firstLetterProfile <= 'z') {
        firstLetterProfile = firstLetterProfile.toUpperCase();
    }

    return firstLetterProfile;
};