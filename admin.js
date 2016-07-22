/* This file handles all web service requests required by admins
   (including analytics) */

var common = require('./common');
var bcrypt = require('bcryptjs');

/* Function for sending JSON response with `OK` status code */
var sendJSONResponse = common.sendBackJSON;

/* Function for sending JSON response with 400 `Bad Request` status code */
var sendBadRequestResponse = common.sendBadRequestResponse;

/* Function for sending JSON response 401 `Unauthorized` status code */
var sendUnauthorizedResponse = common.sendUnauthorizedResponse;

/* Common instance of `sequelize` */
var db = common.db;

exports.handleLoginRequest = function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    
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
        if (bcrypt.compareSync(password, admin.password)) { // Correct password
            var responseBody = {status: 'LOGIN_SUCCESSFUL'};
            sendJSONResponse(responseBody, response);
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