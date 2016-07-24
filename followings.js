var common = require('./common');
var sendBackJSON = common.sendBackJSON;
var db = common.db;

exports.followHandler = function (req, res){
    var follower = req.session.thisid;
    var followee = req.body.followee;
    db.query("INSERT INTO FOLLOWINGS (follower,followee ) VALUES (" + follower +"," + followee + ")" ).spread(function(results, metadata){
        var returnJSON = {
            "status": "success",
            "message": "Success in following"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in follow");
        var returnJSON = {
            "status": "error",
            "message": "Err in follow"
        }
        sendBackJSON(returnJSON, res);
    });
};

exports.unfollowHandler = function (req, res){
    var follower = req.session.thisid;
    var followee = req.body.followee;
    console.log(follower);
    console.log(followee);
    db.query("DELETE FROM FOLLOWINGS WHERE follower =" + follower +" AND followee = " + followee ).spread(function(results, metadata){
        var returnJSON = {
            "status": "success",
            "message": "Success in unfollowing"
        }
        sendBackJSON(returnJSON, res);
    }).catch(function(err){
        console.log("Err in unfollow");
        var returnJSON = {
            "status": "success",
            "message": "Err in unfollow"
        }
        sendBackJSON(returnJSON, res);
    });
}