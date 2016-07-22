var sequelize = require('sequelize');

/* Logged in users */
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

function sendJSONResponse(statusCode, data, response) {
    response.writeHead(statusCode, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
}

exports.checkAuthenticate = function (req, res, next) {
    console.log(exports.currentUser);
    if (req.session && req.session.alive && (exports.currentUser.indexOf(req.session.user) >= 0)) {
        console.log("IN");
        return next();
    } else {
        console.log("NOTIN");
        return res.sendStatus(404);
    }
};