var sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
exports.bcrypt = bcrypt;

exports.currentUser = [];

exports.db = new sequelize('learnrDB', null, null, {
    dialect: 'sqlite',
    storage: __dirname + '/learnrDB.sqlite'
});

exports.sendBackJSON = function (data, response) {
    sendJSONResponse(200, data, response);
};

exports.sendBadRequestResponse = function (data, response) {
    sendJSONResponse(400, data, response);
};

exports.sendUnauthorizedResponse = function (data, response) {
    sendJSONResponse(401, data, response);
};

exports.sendInternalServerErrorResponse = function (response) {
    response.writeHead(500);
    response.end();
};

function sendJSONResponse(statusCode, data, response) {
    response.writeHead(statusCode, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
}

/* Returns the userId of the logged in user or 0 if the user is not logged in. */
function getLoggedInUserId(req) {
    return (req.session && req.session.userId) ? req.session.userId : 0;
}

exports.getLoggedInUserId = getLoggedInUserId;


/* Returns true if a user is logged in and false otherwise. */
function userIsLoggedIn(req) {
    return getLoggedInUserId(req) != 0;
}

exports.userIsLoggedIn = userIsLoggedIn;

/* Sets the given userId as the logged in user. */
exports.setLoggedInUserId = function(req, userId) {
    req.session.userId = userId;
};

/* To be called as a part of a chain in the routing.
 *
 * Calls the next function if the user is logged in and otherwise redirects the
 * user to the home page with a message about needing to log in.
 */
exports.checkAuthentication = function (req, res, next) {
    if (userIsLoggedIn(req)) {
        return next();
    } else {
        if(req.method.toLowerCase() == 'post') {
            res.status(400);
        }
        console.log('access denied to request');
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> You need to be logged in to access that.</p>',
            loggedIn: false
        });
    }
};

/* Redirects a HTTP request to the page specified `relativePath` */
exports.redirectToPage = function(redirectPath, response) {
    response.writeHead(302, {'Location': redirectPath});
    response.end();
};

/* Standard function for generation unique session id */
exports.generateUniqueId = function () {
    return bcrypt.hashSync(Math.random().toString(), 8);
};

/* Common function for hashing passwords */
exports.generatePasswordHash = function (password) {
    return bcrypt.hashSync(password, 8);
};

/* Standard function for checking passwords */
exports.comparePassword = function (password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
};