/* This file handles all web service requests required by admins
   (including analytics) */

var common = require('./common');

/* Function for sending JSON response with `OK` status code */
//var sendJSONResponse = common.sendBackJSON;

/* Function for sending JSON response with 400 `Bad Request` status code */
var sendBadRequestResponse = common.sendBadRequestResponse;

/* Function for sending JSON response 401 `Unauthorized` status code */
var sendUnauthorizedResponse = common.sendUnauthorizedResponse;

/* Common instance of `sequelize` */
var db = common.db;

var loggedInAdmins = [];


/* To be called as a part of a chain in the routing.
 *
 * Calls the next function if the admin is logged in and otherwise redirects the
 * admin to the home page with a message about needing to log in.
 */
exports.checkAuthentication = function(request, response, next) {
    getAnalyticsData();
    
    for (var i = 0; i < loggedInAdmins.length; i++) {
        var admin = loggedInAdmins[i];
        if (admin.sessionId === request.session.id && admin.uniqueId === request.session.unique_id) {
            console.log(admin.sessionId);
            console.log(request.session.id);
            return next();
        }
    }
    
    // Render admin login page if admin is not logged in
    response.render('admin_login');
};

exports.handleAdminHomeRequest = function (request, response) {
    response.render('admin_home');
};


exports.handleLoginRequest = function(request, response) {
    var username = request.body.admin_id;
    var password = request.body.password;
    
    console.log(request.session);
    
    if (username === undefined || password === undefined) {
        /* Return login failed response if username or password
           fields are missing */
        sendMalformedRequestResponse('Missing field', response);
        return;
    }
    
    // TODO: Correct length check
    if (username.length === 0 || password.length === 0) {
        /* Return login failed response if username or password
           fields are of incorrect length */
        sendMalformedRequestResponse('Incorrect field length', response);
        return;
    }
    
    /* Find the admin profile with the given username */
    var queryString = 'SELECT * FROM ADMIN_CREDENTIALS WHERE username = $1';
    db.query(queryString, {bind: [username]}).spread(function(results) {
        
        if (results === undefined || results.length !== 1) {  // Username doesn't exist
            sendInvalidCredentialsResponse(response);
            return;
        }
        var admin = results[0];
        
        // Check if password is correct
        if (common.comparePassword(password, admin.password)) { // Correct password
            // --- Successful login ---
            onSuccessfulLogin(request, response);
        }
        else { // Incorrect password
            sendInvalidCredentialsResponse(response);
        }
    });
};

function sendMalformedRequestResponse(message, response) {
    var responseBody = {status: 'LOGIN_FAILED', 'message': message};
    sendBadRequestResponse(responseBody, response);
}

function sendInvalidCredentialsResponse(response) {
    var responseBody = {status: 'LOGIN_FAILED', message: 'Invalid credentials'};
    sendUnauthorizedResponse(responseBody, response);
}

function onSuccessfulLogin(request, response) {
    // Generate and attach session id
    request.session.unique_id = common.generateUniqueId();
    console.log(request.session.unique_id);
    
    var loggedInSession = {
        sessionId: request.session.id,
        uniqueId: request.session.unique_id
    };
    loggedInAdmins.push(loggedInSession);
    
    // Render Admin Home Page
    response.render('admin_home');
    
    //var responseBody = {status: 'LOGIN_SUCCESSFUL'};
    //sendJSONResponse(responseBody, response);
}



/* Analytics */

function getAnalyticsData() {
    /* --- SQL Queries --- */
    
    /* Total number of users */
    var totalUsers = '(SELECT COUNT(*) AS totalUsers FROM USERS)';
    
    /* Number of unique users who have enrolled for at least one class */
    var usersEnrolledInClass = '(SELECT COUNT(DISTINCT user_id) AS numUsersEnrolledInClass FROM ENROLMENT)';
    
    /* Avg num of unique users per day */
    var avgLogins = '(SELECT AVG(numLogins) AS avgNumLoginsPerDay ' +
                     'FROM (SELECT COUNT(DISTINCT user_id) AS numLogins FROM LOGIN_HISTORY GROUP BY date(login_timestamp)))';
    
    /* Total number of classes */
    var numClasses = '(SELECT COUNT(*) AS numClasses FROM CLASSES)';
    
    /* Avg num of users per class */
    var avgUsersPerClass = '(SELECT (SELECT COUNT(*) FROM USERS) / (SELECT COUNT(*) FROM CLASSES) AS avgUsersPerClass)';
    
    /* Avg rating over all classes */
    var avgClassRating = '(SELECT (COALESCE(AVG(rating), \'-\')) AS avgClassRating FROM REVIEWS)';
    
    /* The final query to be passed in for execution */
    var finalQuery = 'SELECT * FROM ' + totalUsers + ', ' + usersEnrolledInClass + ', ' + avgLogins + ', ' +
                      numClasses + ', ' + avgUsersPerClass + ', ' + avgClassRating;
    
    db.query(finalQuery).spread(function (results) {
        console.log(results);
    });
}