var common = require('./common');

var db = common.db;
var sendBackJSON = common.sendBackJSON;

/* Calls the callback with a list of up to 3 recommended clases for the logged in user.
 *
 * Recommended courses are determined by finding all of a user's classmates and
 * finding the classes which those classmates are taking, returning them in
 * order based on how many fellow classmates are also taking the other courses.
 */
exports.recommendedClasses = function(userId, callback) {
    var queryString =
        'SELECT C.id as class_id, C.class_name, count(*) as user_count ' +
        'FROM CLASSES C ' +
        'INNER JOIN ENROLMENT E ' +
            'ON E.class_id = C.id ' +
        'INNER JOIN FOLLOWINGS F ' +
            'ON F.followee = E.user_id ' +
        // exclude classes the user is already in
        'WHERE C.id NOT IN ( ' +
            'SELECT E1.class_id ' +
            'FROM ENROLMENT E1 ' +
            'WHERE E1.user_id = $1 ' +
        ') ' +
        'AND F.follower = $1 ' +
        'GROUP BY C.id ' +
        'ORDER BY user_count DESC ' +
        'LIMIT 3 '
    ;

    db.query(queryString, { bind: [userId] })
    .spread(function(results, metadata) {
        callback(null, results);
    })
    .catch(function(err) {
        callback(err, null);
    });
}


/* Calls the callback with up to three of the most popular classes. */
exports.popularClasses = function(callback) {
    var queryString =
        'SELECT E.class_id, U.name as instructor, ' +
            'count(*) AS user_count, C.class_name ' +
        'FROM ENROLMENT E ' +
        'INNER JOIN CLASSES C ' +
        	'ON C.id = E.class_id ' +
        'INNER JOIN USERS U ' +
            'ON U.id = C.instructor ' +
        'GROUP BY E.class_id ' +
        'ORDER BY user_count DESC ' +
        'LIMIT 3 '
    ;
    
    db.query(queryString)
    .spread(function(results, metadata) {
        callback(null, results);
    })
    .catch(function(err) {
        callback(err, null);
    });
}