var common = require('./common');
var db = common.db;


/* Fetches the userId which corresponds to the given googleId.
 *
 * Note that the callback is called with the error information, if any, 
 * and the userId if successful; if the user does not exist, the id will be 0.
 */
function fetchUser(googleId, callback) {
    console.log('entering fetchUser()');
    
    var query =
        'SELECT user_id ' +
        'FROM GOOGLE_CREDENTIALS ' +
        'WHERE id = $1 '
    ;
    
    db.query(query, { bind: [googleId] })
    .spread(function(results, metadata) {
        var userId = 0;
        
        if (results[0] && results[0].user_id) {
            console.log('found matching google user');
            userId = results[0].user_id;
        }
        else {
            console.log('did not find matching google user');
        }
        
        callback(null, userId);
    })
    .catch(function(err) {
        console.log(err);
        callback(err, null);
    });
}


/* Creates a new user with the given name and GoogleId.
 *
 * Note that the callback is called with the error information, if any, 
 * and the userId if successful.
 */
function createUser(googleId, name, callback) {
    console.log('entering createUser()');
    
    db.transaction(function (transactionObject) {
        // Insert into USERS table
        return db.query("INSERT INTO USERS (name) VALUES ( $1 )", {
                transaction: transactionObject,
                bind: [name]
            })
            .then(function (result) {
                var metadata = result[1];

                // Insert into LOGIN_CREDENTIALS table
                return db.query("INSERT INTO GOOGLE_CREDENTIALS (id, user_id) VALUES ( $1 , $2 )", {
                    transaction: transactionObject,
                    bind: [googleId, metadata.lastID]
                });
            });
    }).then(function (results) {
        console.log('insert into users for google account succeeded');
        
        // Transaction has been successfully committed
        var metadata = results[1];

        // return userId to caller
        callback(null, metadata.lastID);

    }).catch(function (err) {
        console.log(err);
        // roll back and send an error to the callback
        callback('failed to create user', 0);
    });
}


/* Fetches the userId which corresponds to the given googleId or creates one
 * if none is found.
 *
 * Note that the callback is called with the error information, if any, 
 * and the userId if successful.
 */
function findOrCreateUser(profile, callback) {
    console.log('entering findOrCreateUser()');
    
    var googleId = profile.id;
    console.log('processing google id [' + googleId + ']');
    
    fetchUser(googleId, function(err, userId) {
        // if there was an error, continue throwing it
        if (err) {
            console.log('error fetching user for google account');
            callback(err);
        }
        // if there was a user found, return the id
        else if (userId != 0) {
            console.log('user found for google account');
            callback(null, userId);
        }
        // otherwise, we need to create a user
        else {
            console.log('creating new user for google account');
            createUser(googleId, profile.displayName, function(err, userId) {
                // if there was an error, continue throwing it
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, userId);
                }
            });
        }
    });
}


exports.fetchUser = fetchUser;
exports.findOrCreateUser = findOrCreateUser;