var assert = require('chai').assert;
var analytics = require('../analytics.js');

var db = require('../common.js').db;

describe('analytics()', function() {
    
    describe('getAnalyticsDataForAdminDashboard()', function() {
       
       it('analytics data retreival success', function() {

            /* Total number of users */
            var totalUsers = '(SELECT COUNT(*) AS totalUsers FROM USERS)';
        
            /* Number of unique users who have enrolled for at least one class */
            var usersEnrolledInClass = '(SELECT COUNT(DISTINCT user_id) AS numUsersEnrolledInClass FROM ENROLMENT)';
        
            /* Avg num of unique users per day */
            var avgLogins = '(SELECT COALESCE(AVG(numLogins), \'-\') AS avgUniqueLoginsPerDay ' +
                'FROM (SELECT COUNT(DISTINCT user_id) AS numLogins FROM LOGIN_HISTORY GROUP BY date(login_timestamp)))';
        
            /* Total number of classes */
            var numClasses = '(SELECT COUNT(*) AS numClasses FROM CLASSES)';
        
            /* Avg num of users per class */
            var avgUsersPerClass = '(SELECT COALESCE((SELECT COUNT(*) FROM ENROLMENT) / (SELECT COUNT(*) FROM CLASSES), \'-\') ' +
                'AS avgUsersPerClass)';
        
            /* Avg rating over all classes */
            var avgClassRating = '(SELECT (COALESCE(AVG(rating), \'-\')) AS avgClassRating FROM REVIEWS)';
        
            /* The final query to be passed in for execution */
            var finalQuery = 'SELECT * FROM ' + totalUsers + ', ' + usersEnrolledInClass + ', ' + avgLogins + ', ' +
                numClasses + ', ' + avgUsersPerClass + ', ' + avgClassRating;
        
            db.query(finalQuery).spread(function (results) {
                analytics.getAnalyticsDataForAdminDashboard(db, function (status, data) {
                    assert.equal('Success', status);
                    assert.equal(results[0].totalUsers, data.totalUsers);
                    assert.equal(results[0].usersEnrolledInClass, data.usersEnrolledInClass);
                    assert.equal(results[0].avgLogins, data.avgLogins);
                    assert.equal(results[0].numClasses, data.numClasses);
                    assert.equal(results[0].avgUsersPerClass, data.avgUsersPerClass);
                    assert.equal(results[0].avgClassRating, data.avgClassRating);
                });
            });
        
       }); 
    });
});