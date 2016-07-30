/* Tracks a users logins by recording their user id and current timestamp in the database */
exports.trackUserLogin = function (userId, database) {

    // Check if userId is valid
    var isUserIdValid = (userId !== undefined || userId > 0);

    if (!isUserIdValid) {
        return false;
    }

    var query = 'INSERT INTO LOGIN_HISTORY (user_id) VALUES ($1)';
    database.query(query, {
        bind: [userId]
    }); // Timestamp is automatically captured by the database

    return isUserIdValid;
};

/* Provides analytics data for the admin dashboard. Data is provided back to the caller
 * through the `callback` function.
 */
exports.getAnalyticsDataForAdminDashboard = function (database, callback) {

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

    database.query(finalQuery).spread(function (results) {
        if (results === undefined || results.length !== 1) {
            // We shouldn't get here
            callback('Database Error');
            return;
        }

        // Send data back to the caller
        callback('Success', results[0]);
    });
};