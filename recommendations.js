var common = require('./common');

var db = common.db;
var sendBackJSON = common.sendBackJSON;

exports.userCourses = function(req, res) {
    // todo: get userId from session
    var userId = req.body.user_id;
    
    db.query('select count(*) as userCount from users').spread(function(result, metadata) {
        sendBackJSON({"count": result[0].userCount}, res);
    });
}