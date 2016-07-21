var sequelize = require('sequelize');

exports.currentUser = new Array();

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