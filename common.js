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

/* Sets the given userId as the logged in user. */
exports.setLoggedInUserId = function(req, userId) {
    req.session.userId = userId;
}

exports.checkAuthenticate = function (req, res, next) {
    if (getLoggedInUserId(req) != 0) {
        console.log("IN");
        return next();
    } else {
        console.log("NOTIN");
        return res.sendStatus(404);
    }
};