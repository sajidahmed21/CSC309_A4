var common = require('./common');
var db = common.db;
var getLoggedInUserId = common.getLoggedInUserId;


/* Creates all notifications that a user enrolled in a certain class.
 *
 * Returns the result of the callback. Note that the callback is called with
 * an error if one occurred, or null otherwise.
 */
function notifyOfClassEnrolment(userId, classId) {
    var query =
        'INSERT INTO NOTIFICATIONS(user_id, followee_id, class_id) ' +
        'VALUES (' +
            'SELECT follower_id, $1, $2 ' +
            'FROM FOLLOWINGS ' +
            'WHERE followee_id = $1 ' +
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


/* Marks all provided notification as seen, provided that they belong to the
 * logged in user.
 *
 * Returns the result of the callback. Note that the callback is called with
 * an error if one occurred, or null otherwise.
 */
function markAsSeen(notificationIds) {
    var query =
        'UPDATE NOTIFICATIONS ' +
        'SET seen = 1 ' +
        'WHERE notification_id IN [$1] AND user_id = $2 '
    ;
    
    db.query(query, { bind: [notificationIds, getLoggedInUserId()] })
    .then() {
        return callback(null);
    }
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
function recentNotifications(limit, callback) {
    var query =
        'SELECT N.notification_id, N.seen, N.class_id, N.created_timestamp ' +
            'U.name, ' +
            'C.class_name, I.name ' +
        'FROM NOTIFICATIONS N' +
        // the folowee's information
        'INNER JOIN USERS U ' +
            'ON U.id = N.followee_id '
        // instructor's information
        'INNER JOIN USERS I ' +
            'ON I.id = C.instructor ' +
        'WHERE user_id = $1' +
        'ORDER BY created_timestamp DESC ' +
        'LIMIT $2'
    ;
    
    if (limit < 0) {
        limit = 10;
    }
    
    db.query(query, { bind: [getLoggedInUserId(), limit] })
    .spread(function(results, metadata) {
        return callback(null, results);
    })
    .catch(function(err) {
        return callback(err, null);
    });
}


exports.notifyOfClassEnrolment = notifyOfClassEnrolment;
exports.markAsSeen = markAsSeen;
exports.recentNotifications = recentNotifications;