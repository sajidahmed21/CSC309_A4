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
    response.writeHead(statusCode, {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    });
    response.end(JSON.stringify(data));
}