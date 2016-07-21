var common = require('./common');
var sendBackJSON = common.sendBackJSON;
var db = common.db;

exports.followHandler = function (req, res){
    var follower = req.body.follower;
    var followee = req.body.followee;
    db.query("INSERT INTO FOLLOWINGS (follower,followee ) VALUES (" + follower +"," + followee + ")" ).spread(function(results, metadata){
        var returnJSON = {
            "success": "Success in following"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in follow");
        var returnJSON = {
            "error": "Err in follow"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.unfollowHandler = function (req, res){
    var follower = req.body.follower;
    var followee = req.body.followee;
    db.query("DELETE FROM FOLLOWINGS WHERE follower =" + follower +" AND followee = " + followee ).spread(function(results, metadata){
        var returnJSON = {
            "success": "Success in unfollowing"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in unfollow");
        var returnJSON = {
            "error": "Err in unfollow"
        }
        sendBackJSON(returnJSON, res);
    });
}