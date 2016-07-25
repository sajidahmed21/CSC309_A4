var common = require('./common');

var db = common.db;
var sendBackJSON = common.sendBackJSON;

/* Calls the callback with a list of up to 3 recommended courses for the logged in user.
 *
 * Recommended courses are determined by finding all of a user's classmates and
 * finding the classes which those classmates are taking, returning them in
 * order based on how many fellow classmates are also taking the other courses.
 */
exports.recommendedCourses = function(userId, callback) {
    var queryString =
        'SELECT E.class_id, U.name, ' +
            'count(*) as user_count, C.class_name ' +
        'FROM ENROLMENT E ' +
        'INNER JOIN Classes C ' +
            'ON C.id = E.class_id ' +
        'INNER JOIN USERS U ' +
            'ON U.id = C.instructor ' +
        'WHERE E.user_id IN ( ' +
        	'SELECT DISTINCT E2.user_id ' +
        	'FROM ENROLMENT E2 ' +
        	'WHERE E2.class_id in ( ' +
        		'SELECT DISTINCT E1.class_id ' +
        		'FROM ENROLMENT E1 ' +
        		'WHERE E1.user_id = $1 ' +
        	') ' +
        ') ' +
        'GROUP BY E.class_id ' +
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


/* Calls the callback with up to three of the most popular courses. */
exports.popularCourses = function(callback) {
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