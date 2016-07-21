var common = require('./common');

var db = common.db;
var sendBackJSON = common.sendBackJSON;

/* Sends back a list of up to ten recommended courses for the logged in user.
 *
 * Recommended courses are determined by finding all of a user's classmates and
 * finding the classes which those classmates are taking, returning them in
 * order based on how many fellow classmates are also taking the other courses.
 */
exports.userCourses = function(req, res) {
    // todo: get userId from session
    if (req.query.user_id > 0) {
        var queryString =
            'SELECT E.class_id, count(*) as user_count, C.class_name ' +
            'FROM ENROLMENT E ' +
            'INNER JOIN Classes C ' +
                'ON C.id = E.class_id ' +
            'WHERE E.user_id IN ( ' +
            	'SELECT DISTINCT E2.user_id ' +
            	'FROM ENROLMENT E2 ' +
            	'WHERE E2.class_id in ( ' +
            		'SELECT DISTINCT E1.class_id ' +
            		'FROM ENROLMENT E1 ' +
            		'WHERE E1.user_id = ? ' +
            	') ' +
            ') ' +
            'GROUP BY E.class_id ' +
            'ORDER BY user_count DESC ' +
            'LIMIT 10 '
        ;
    
        db.query(queryString, {
            replacements: [req.query.user_id]
        })
        .spread(function(results, metadata) {
            sendBackJSON({"courses": results}, res);
        })
        .catch(function(err) {
            console.log('failed to fetch recommendations:');
            console.log(err);
            
            sendBackJSON({'error': 'server error'}, res);
        });
    }
    else {
        sendBackJSON({'error': 'no user is logged in'}, res);
    }
}


/* Sends back up to ten of the most popular courses. */
exports.popularCourses = function(req, res) {
    var queryString =
        'SELECT E.class_id, count(*) AS user_count, C.class_name ' +
        'FROM ENROLMENT E ' +
        'INNER JOIN CLASSES C ' +
        	'ON C.id = E.class_id ' +
        'GROUP BY E.class_id ' +
        'ORDER BY user_count DESC ' +
        'LIMIT 10 '
    ;
    
    db.query(queryString)
    .spread(function(results, metadata) {
        sendBackJSON({"courses": results}, res);
    })
    .catch(function(err) {
        console.log('failed to fetch popular courses:');
        console.log(err);
        
        sendBackJSON({'error': 'server error'}, res);
    });
}