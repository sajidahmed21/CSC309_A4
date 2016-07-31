var common = require('./common');

var db = common.db;
var sendBackJSON = common.sendBackJSON;

/* Calls the callback with a list of recommended clases for the logged in user.
 *
 * Recommended courses are determined by finding all of a user's classmates and
 * finding the classes which those classmates are taking, returning them in
 * order based on how many fellow classmates are also taking the other courses.
 */
exports.recommendedClasses = function(userId, limit, callback) {
    var queryString =
        'SELECT C.id as class_id, C.class_name, C.coursedesc AS class_description, I.name AS instructor, ' +
            'count(*) as user_count ' +
        'FROM CLASSES C ' +
        'INNER JOIN ENROLMENT E ' +
            'ON E.class_id = C.id ' +
        'INNER JOIN FOLLOWINGS F ' +
            'ON F.followee = E.user_id ' +
        'INNER JOIN USERS I ' +
            'ON I.id = C.instructor ' +
        // exclude classes the user is already in
        'WHERE C.id NOT IN ( ' +
            'SELECT E1.class_id ' +
            'FROM ENROLMENT E1 ' +
            'WHERE E1.user_id = $1 ' +
        // exclude classes where the user is the instructor
            ') AND C.id NOT IN (' +
                'SELECT C1.id ' +
                'FROM CLASSES C1 ' +
                'WHERE C1.instructor = $1 ' +
            ') ' +
        'AND F.follower = $1 ' +
        'GROUP BY C.id ' +
        'ORDER BY user_count DESC ' +
        'LIMIT $2 '
    ;

    db.query(queryString, { bind: [userId, limit] })
    .spread(function(results, metadata) {
        callback(null, results);
    })
    .catch(function(err) {
        callback(err, null);
    });
}


/* Calls the callback with the most popular classes. */
exports.popularClasses = function(limit, callback) {
    var queryString =
        'SELECT E.class_id, U.name as instructor, ' +
            'count(*) AS user_count, C.class_name, C.coursedesc AS class_description ' +
        'FROM ENROLMENT E ' +
        'INNER JOIN CLASSES C ' +
        	'ON C.id = E.class_id ' +
        'INNER JOIN USERS U ' +
            'ON U.id = C.instructor ' +
        'GROUP BY E.class_id ' +
        'ORDER BY user_count DESC ' +
        'LIMIT $1 '
    ;
    
    db.query(queryString, { bind: [limit] })
    .spread(function(results, metadata) {
        callback(null, results);
    })
    .catch(function(err) {
        callback(err, null);
    });
}