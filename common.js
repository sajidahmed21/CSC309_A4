var sequelize = require('sequelize');

exports.db = new sequelize('learnrDB', null, null, {
    dialect: 'sqlite',
    storage: __dirname + '/learnrDB.sqlite'
});

exports.sendBackJSON = function (data, response) {
    response.writeHead(200, {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    });
    response.end(JSON.stringify(data));
};

exports.sendBadRequestResponse = function (data, response) {
    response.writeHead(400, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
};

exports.sendUnauthorizedResponse = function (data, response) {
    response.writeHead(401, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
};