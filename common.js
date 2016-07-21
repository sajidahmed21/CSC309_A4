var sequelize = require('sequelize');

exports.db = new sequelize('learnrDB', null, null, {
    dialect: 'sqlite',
    storage: __dirname + '/learnrDB.sqlite'
});

exports.sendBackJSON = function (retJSON, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    });
    res.write(JSON.stringify(retJSON));
    res.end();
};