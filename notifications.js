var common = require('./common');
var db = common.db;
var getLoggedInUserId = common.getLoggedInUserId;


/* Creates all notifications that a user enrolled in a certain class.
 *
 * Returns the result of the callback. Note that the callback is called with
 * an error if one occurred, or null otherwise.
 */
function notifyOfClassEnrollment(userId, classId) {
    var query =
        'INSERT INTO NOTIFICATIONS(user_id, followee_id, class_id) ' +
        'VALUES (' +
            'SELECT follower_id, $1, $2 ' +
            'FROM FOLLOWINGS ' +
            // only where the followee is this user, and there hasn't already
            // been a notification for this added
            'WHERE followee_id = $1 AND user_id NOT IN ( ' +
                'SELECT N1.user_id ' +
                'FROM NOTIFICATIONS N1 ' +
                'WHERE N1.followee_id = $1 AND N1.class_id = $2 ' +
            ')' +
        ')'
    ;
    
    db.query(query, { bind: [userId, classId] })
    .spread(function(results, metadata) {
        return callback(null);
    })
    .catch(function(err) {
        return callback(err);
    });
}


/* Fetches an array of most recent notifications, up to the provided limit,
 * ordered from most recent to least recent. If the limit is negative,
 * fetches up to ten notifications.
 *
 * Returns the result of the callback. Note that the callback is called with
 * the error information, if any, and the results if successful.
 */
function recentNotifications(userId, limit, callback) {
    var query =
        'SELECT N.id AS notification_id, N.created_timestamp AS timestamp, ' +
            'U.name AS followee_name, ' +
            'C.id AS class_id, C.class_name, I.name ' +
        'FROM NOTIFICATIONS N ' +
        // the folowee's information
        'INNER JOIN USERS U ' +
            'ON U.id = N.followee_id ' +
        // instructor's information
        'INNER JOIN USERS I ' +
            'ON I.id = C.instructor ' +
        'INNER JOIN CLASSES C ' +
            'ON C.id = N.class_id ' +
        'WHERE user_id = $1 ' +
        'ORDER BY N.created_timestamp DESC ' +
        'LIMIT $2'
    ;
    
    if (limit < 0) {
        limit = 10;
    }
    
    db.query(query, { bind: [userId, limit] })
    .spread(function(results, metadata) {
        return callback(null, results);
    })
    .catch(function(err) {
        return callback(err, null);
    });
}


exports.notifyOfClassEnrollment = notifyOfClassEnrollment;
exports.recentNotifications = recentNotifications;