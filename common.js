var sequelize = require('sequelize');

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
}

/* To be called as a part of a chain in the routing.
 *
 * Calls the next function if the user is logged in and otherwise redirects the
 * user with a 404 error.
 */
exports.checkAuthentication = function (req, res, next) {
    if (userIsLoggedIn(req)) {
        return next();
    } else {
        console.log('access denied to request');
        return res.render('home', {
            errorContent: '<p><strong>Opps!</strong> You need to be logged in to access that.</p>',
            loggedIn: false
        });
    }
};