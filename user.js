var common = require('./common');
var home = require('./home');
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
    if (!userId || userId === '') {
        callback('Invalid user id');
        return;
    }
    if (!newName || newName === '') {
        callback('Invalid name');
        return;
    }
    //update user name query
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

        //if success return success JSON else return error
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
    //no user id, null user id, or user id = 0
    if (!userId) {
        callback('Invalid user id');
        return;
    }

    //invalid current password
    if ((!currentPassword || currentPassword.length < 8 || currentPassword.length > 20) && !isAdminChanging) {
        callback('Incorrect password');
        return;
    }

    //invalid new password
    if (!newPassword || newPassword.length < 8 || newPassword.length > 20) {
        callback('Invalid new password');
        return;
    }

    //invalid new password confirm
    if (!newPasswordConfirm || newPasswordConfirm.length < 8 || newPasswordConfirm.length > 20) {
        callback('Invalid old password');
        return;
    }

    //password and confrim password does not match
    if (newPassword !== newPasswordConfirm) {
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

        //if success return success JSON else return error JSON with error msg
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

    //update password query
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

    //select all from login credentials
    db.query('SELECT * FROM LOGIN_CREDENTIALS WHERE user_id = $1', {
        bind: [userId]
    }).spread(function (results) {
        if (results === undefined || results.length != 1) {
            callback('Error');
            return;
        }

        // check if password input match with database password
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

    //profile color change
    db.query("UPDATE USERS SET profile_color = $1 WHERE id= $2", {
        bind: [changeProfilepic, user_id]
    }).spread(function (results, metadata) {
        //if success return change success
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

//helper for stop teaching course
exports.stopTeachingHelper = function (user_id, class_id, callback) {

    //delete the class from CLASSES table
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

    //execute stopteaching helper. Return success if deleted, else return error
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

//Unenroll helper for unenroll a user in a course
exports.unenrollUser = function (userId, classId, callback) {

    //check for invalid 
    if (userId === undefined || userId < 1 || classId === undefined || classId < 1) {
        callback('Invalid input');
        return;
    }

    //delete the enrollment of the user
    db.query("DELETE FROM ENROLMENT WHERE user_id= $1 AND class_id = $2", {
        bind: [userId, classId]
    }).spread(function () {
        callback('Success');
    }).catch(function () {
        callback('Error');
    });
};

//Handler for unenroll
exports.unenrollHandler = function (req, res) {
    var userId = getLoggedInUserId(req);
    var classId = req.body.dropCourse_id;

    //call the unenroll helper to check whether the unenroll is successful or fail
    exports.unenrollUser(userId, classId, function (result) {
        var responseBody = {};

        //return success JSOn if success, else return error in unenroll process
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


/* Checks whether the given userId refers to a Google user and calls the callback.
 *
 * Note that the callback will be called with the error information (if any) and
 * the result of the query, if successful. 
 */
function isGoogleUser(userId, callback) {
    var query =
        'SELECT user_id ' +
        'FROM GOOGLE_CREDENTIALS ' +
        'WHERE user_id = $1 ';

    db.query(query, {
            bind: [userId]
        })
        .spread(function (results, metadata) {
            // cast the result as a boolean: if a row was returned, this
            // is a Google user
            callback(null, results[0] ? true : false);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

exports.isGoogleUser = isGoogleUser;


/* Renders the profile for the user with the userId equal to profileUserId. */
var getProfileHandler = function (req, res, profileUserId) {
    console.log("GETPROFILE" + profileUserId);
    console.log(common.getLoggedInUserId(req));

    //select name and profile_color from USERS table
    db.query("SELECT name, profile_color FROM USERS WHERE id = $1", {
        bind: [profileUserId]
    }).spread(function (results, metadata) {
        var name = results[0].name;

        //check if the color exist
        var background_color = results[0].profile_color;
        if (color.indexOf(background_color) < 0)
            background_color = 'grey_background';

        //capital the first character if a-z
        var firstLetterProfile = name.charAt(0);
        if (firstLetterProfile >= 'a' && firstLetterProfile <= 'z')
            firstLetterProfile = firstLetterProfile.toUpperCase();
        console.log('HERREEEEEE');

        //select the class enrolled in
        db.query("SELECT CLASSES.id AS id, CLASSES.class_name AS class_name, USERS.name AS instructor FROM ENROLMENT, CLASSES, USERS WHERE USERS.id=CLASSES.instructor AND CLASSES.id=ENROLMENT.class_id AND ENROLMENT.user_id = $1", {
            bind: [profileUserId]
        }).spread(function (result, meta) {

            //select whether it is followed
            db.query("SELECT EXISTS(SELECT 1 FROM FOLLOWINGS WHERE follower = $1 AND followee= $2 ) AS checkfollow", {
                bind: [getLoggedInUserId(req), profileUserId]
            }).spread(function (resultInner, metaInner) {
                var boolFollow = false;
                if (resultInner[0]['checkfollow'] == 1)
                    boolFollow = true;
                var classenroll = result;
                console.log(result);

                //select the class teaching for this user
                db.query("SELECT class_name, name AS instructor, CLASSES.id AS id FROM USERS, CLASSES WHERE USERS.id = $1 AND USERS.id = instructor", {
                    bind: [profileUserId]
                }).spread(function (classtaught, metadata) {
                    var classteaching = classtaught;
                    console.log(classteaching);

                    // if the user is not the owner, render the page now
                    if (profileUserId != getLoggedInUserId(req)) {
                        res.render('profile', {
                            profile_name: firstLetterProfile,
                            background_color: background_color,
                            name: name,
                            classes: classenroll,
                            classteaching: classteaching,
                            loggedIn: common.userIsLoggedIn(req),
                            current_id: profileUserId,
                            followed: boolFollow,
                            userIsOwner: false
                        });
                    }
                    // otherwise, fetch any necessary information for the owner
                    else {
                        isGoogleUser(profileUserId, function (err, result) {
                            // on error, render the home page with an erro 
                            if (err) {
                                home.render(req, res, '<p><strong>Oh no!</strong> Something went wrong and we can\'t access your profile.</p>');
                            } else {
                                //if all success render page
                                res.render('profile', {
                                    profile_name: firstLetterProfile,
                                    background_color: background_color,
                                    name: name,
                                    classes: classenroll,
                                    classteaching: classteaching,
                                    loggedIn: common.userIsLoggedIn(req),
                                    current_id: profileUserId,
                                    followed: boolFollow,
                                    userIsOwner: true,
                                    isGoogleUser: result
                                });
                            }
                        });
                    }
                });
            });
        });

    }).catch(function (err) {
        //if fail return error msg
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

    //check for invalid input and return accordingly
    if (signinUsername == null || signinUsername == undefined || signinUsername == '' || signinPassword == null || signinPassword == undefined || signinPassword == '') {
        if (testing != undefined)
            return testing('Missing Required Field!');
        else {
            res.status(401);
            return res.render('home', {
                errorContent: '<p><strong>Opps!</strong> Some of your required fields are missing!</p>',
                loggedIn: false
            });
        }
    }

    //check for invalid input and return accordingly
    if (signinUsername.length < 8 || signinUsername.length > 20 || signinPassword.length < 8 || signinPassword.length > 20) {
        if (testing != undefined)
            return testing('Too long / Too Short Username or Password');
        else {
            res.status(401);
            return res.render('home', {
                errorContent: '<p><strong>Opps!</strong> Your username and password must be at least 8 characters long and max 20 characters!</p>',
                loggedIn: false
            });
        }
    }

    //get the password and user_id. check if  password match
    db.query("SELECT user_id, password FROM LOGIN_CREDENTIALS WHERE username = $1", {
        bind: [signinUsername]
    }).spread(function (results, metadata) {
        var thisid = results[0].user_id;
        console.log(thisid);
        bcrypt.compare(signinPassword, results[0].password, function (err, result) {
            if (err || result === false) {

                //if result == false return error
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

        //return error if invalid match
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

    //new a user
    exports.createUser(name, username, password, passwordConfirmation, function (errorType, userId) {

        console.log(errorType);
        if (errorType === undefined) { // Success
            // Automatically log the user in
            setLoggedInUserId(request, userId);
            common.redirectToPage('/user/profile', response);
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
        case 'Incorrect Name Length':
            response.status(401);
            return response.render('home', {
                errorContent: '<p><strong>Opps!</strong> Your name can be a maximum of 20 characters!</p>',
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
        default:
            response.status(401);
            return response.render('home', {
                errorContent: '<p><strong>Opps!</strong> Something went wrong. Contact the system administrator for help.</p>',
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

    /* Error checking: all fields must be provided and valid,
       therefore they cannot be undefined, null, or empty string
     */
    if (!name || !username || !password) {
        callback('Required field missing');
        return;
    }

    //check for invalid input and return accordingly
    if (password != passwordConfirmation) {
        callback('Passwords Don\'t Match');
        return;
    }

    //check for invalid input and return accordingly
    if (username.length < 8 || username.length > 20) {
        callback('Incorrect Username Length');
        return;
    }

    //check for invalid input and return accordingly
    if (name.length > 24) {
        callback('Incorrect Name Length');
        return;
    }

    //check for invalid input and return accordingly
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
        common.redirectToPage('/', res);
    }
    // otherwise return an error
    else {
        setLoggedInUserId(req, 0);
        console.log("NOTLOGGINOUT");
        home.render(req, res, '<p><strong>Opps!</strong> We weren\'t able to log you out. Please try again or close your browser.</p>');
    }
};

exports.logoutHandler = logoutHandler;
exports.test.logoutHandler = logoutHandler;

//delete user helper
exports.deleteUser = function (userId, callback) {
    //check if invalid input
    if (userId === undefined || userId < 1 || userId === '') {
        callback('Invalid user id');
        return;
    }

    //delete user from LOGIN_CREDENTIALS on delete casacde applies to all other table
    db.query("DELETE FROM LOGIN_CREDENTIALS WHERE user_id= $1", {
        bind: [userId]

    }).spread(function (result) {
        db.query("DELETE FROM USERS WHERE id= $1", {
            bind: [userId]
        }).spread(function (results) {
            callback('Success');

        }).catch(function (err) {
            callback('Error deleting user');
        });

    }).catch(function (errs) {
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
exports.test.deleteUser = exports.deleteUser;
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