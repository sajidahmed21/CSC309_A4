
/* Tracks a users logins by recording their user id and current timestamp in the database */
exports.trackUserLogin = function (userId, database) {

    // Check if userId is valid
    var isUserIdValid = (userId !== undefined || userId > 0);
    
    if (!isUserIdValid) {
        return false;
    }
    
    var query = 'INSERT INTO LOGIN_HISTORY (user_id) VALUES ($1)';
    database.query(query, {bind: [userId]});  // Timestamp is automatically captured by the database
    
    return isUserIdValid;
};