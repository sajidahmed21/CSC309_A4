var common = require('./common');

var db = common.db;
var sendBadRequestResponse = common.sendBadRequestResponse;
var sendBackJSON = common.sendBackJSON;

var messaging = require('./messaging');


/* helper functions --------------------------------------------------------*/

/* Takes in a query word and a matching string and returns how well the string
 * matches the query words as an integer score.
 */
function scorePart(query, string) {
    // split the string into words and filter the ones which contain the query
    var matchingWords = string.split(' ').filter(function(word) {
        return word.indexOf(query) !== -1;
    });
    
    // go through each matching word, with a base score relative to the
    // number of matching words
    var score = matchingWords.reduce(function(score, word) {
        // if the word matches at the beginning, add an additional bonus
        if (word.startsWith(query)) {
            score += 5;
        }
        
        var lengthDifference = word.length - query.length;
        
        // for an exact match, add another bonus
        if (lengthDifference === 0) {
            score += 10;
        }
        // otherwise, deduct from the score for every missing letter
        else {
            score -= lengthDifference;
        }
        
        return score;
    }, matchingWords.length * 10);
    
    return score;
}


/* Takes in two strings, a query string and a matching string, and returns the
 * sum of the score of each word in the query string in the matching string.
 */
function scoreString(queryString, string) {
    return queryString.split(' ').reduce(function(score, query) {
        return score + scorePart(query, string);
    }, 0);
}


/* Goes through an array of results and adds a score field to each one. The score
 * field be set to how well the text in each result's searchField matches with
 * each word in the query.
 */
function scoreResults(query, searchField, results) {
    results.forEach(function(result) {
        result.score = scoreString(query.toLowerCase(), result[searchField].toLowerCase());
    });
}


/* Compares the scores of two results.
 *
 * Returns 0 if the scores are the same, > 0 if result2 has a higher score,
 * or <0 if result1 has a higher score.
 */
function compareResultScores(result1, result2) {
    return result2.score - result1.score;
}


/* Sorts an array of results which have scores, ordering them in descending
 * order of score.
 */
function sortResults(results) {
    results.sort(compareResultScores);
}


/* Removes elements from the end of the results until the specified limit
 * has been reached. If the limit is null, no results will be removed, and if
 * it is negative, all results will be removed.
 */
function limitResults(limit, results) {
    if (limit !== null) {
        while (results.length > limit && results.length > 0) {
            results.pop();
        }
    }
}


/* Runs a given query for search results, adds scores to the results
 * and calls the callback with an ordered and limited list of the results.
 *
 * Note that the query must have a column called 'matchingString', which will
 * be used for scoring. Moreover, to work with the jQuery autocomplete, either
 * the query or the callback should:
 *  1. Add a 'data' field.
 *  2. Add a 'value' field.
 *  3. Wrap the results in an objections under the key 'suggestions'.
 *
 * An array of additional bindings can be used, with its parameters starting
 * at $2.
 */
function search(query, searchString, likeSearch, limit, additionalBindings, callback) {
    var searchParameter = likeSearch ? '%' + searchString + '%' : searchString;
    
    db.query(query, {bind: [searchParameter].concat(additionalBindings)})
    .spread(function(results, metadata) {
       scoreResults(searchString, 'matchingString', results);
       sortResults(results);
       limitResults(limit, results);

       callback(results);
   });
}


/* Takes in two strings and attempts to create a string 'primary (secondary)'
 * out of them. However if only one of the two string is provided, the created
 * string is equal to whichever was provided.
 *
 * Returns the string.
 */
function mergeStrings(primary, secondary) {
    if (primary && secondary) {
        return primary + ' (' + secondary + ')';
    }
    else if (primary) {
        return primary;
    }
    else {
        return secondary;
    }
}


/* Searches for users by name and calls the callback with the results. */
function searchUsersByName(searchString, limit, userId, callback) {
    var query =
        'SELECT U.name, LC.username, U.id AS data, ' +
            'U.name AS matchingString ' +
        'FROM USERS U ' +
        'LEFT OUTER JOIN LOGIN_CREDENTIALS LC ' +
            'ON LC.user_id = U.id ' +
        'WHERE U.name LIKE $1 AND U.id != $2 '
    ;
    
   search(query, searchString, true, limit, [userId], function(results) {
       // add a value field and strip out unneeded fields
       results.forEach(function(result) {
           result.value = mergeStrings(result.name, result.username);

           result['matchingString'] = undefined;
           result['name'] = undefined;
           result['username'] = undefined;
       });
       
       callback(results);
   });
}


/* Searches for users by username and calls the callback with the results. */
function searchUsersByUsername(searchString, limit, userId, callback) {
    var query =
        'SELECT U.name, LC.username, U.id AS data, ' +
            'LC.username AS matchingString ' +
        'FROM USERS U ' +
        'INNER JOIN LOGIN_CREDENTIALS LC ' +
            'ON LC.user_id = U.id ' +
        'WHERE LC.username LIKE $1 AND U.id != $2 '
    ;
    
    search(query, searchString, true, limit, [userId], function(results) {
        // add a value field and strip out unneeded fields
        results.forEach(function(result) {
            result.value = mergeStrings(result.name, result.username);

            result['matchingString'] = undefined;
            result['name'] = undefined;
            result['username'] = undefined;
        });

        callback(results);
   });
}


/* Returns all items in results1 which do not appear in results2 (based on the
 * data field) or which have a higher score. If keepEquals is true, items from
 * results1 which have a duplicate in results2 of the same score will be kept.
 */
function _mergeResults(results1, results2, keepEquals) {
    return results1.filter(function(result1) {
        var duplicateResult = results2.find(function(result2) {
            // return true if the userIds match
            return result1.data == result2.data;
        });
        
        // return true if there was no dupplicate, the duplicate has a lower score
        // or we are accepting equal scores and the score was equal
        return (!duplicateResult || 
            (duplicateResult.score < result1.score) ||
            (keepEquals && duplicateResult.score == result1.score));
    });
}


/* Returns an array of items from results1 and results2 which either do not
 * belong in the other or which have a higher score.
 */
function mergeResults(results1, results2) {
    return _mergeResults(results1, results2, true).concat(_mergeResults(results2, results1, false));
}


/* Searches for users by name username and calls the callback with the results. */
function searchUsers(searchString, limit, userId, callback) {
    searchUsersByName(searchString, null, userId, function(nameResults) {
        searchUsersByUsername(searchString, null, userId, function(usernameResults) {
            // merge the two result arrays, resolving duplicates by keeping
            // the one with the higher score
            var results = mergeResults(nameResults, usernameResults);
            
            // resort the merged results and then add a limit on them
            // so that we limit the highest amongst both searches
            sortResults(results);
            limitResults(limit, results);
            
            // finally call the callback
            callback(results);
        });
    });
}


/* Searches for a specific user by userid and calls the callback with the results. */
function searchForUser(searchString, callback) {
    var query =
        'SELECT U.name, LC.username, U.id AS data, ' +
            'LC.username AS matchingString ' +
        'FROM USERS U ' +
        'LEFT OUTER JOIN LOGIN_CREDENTIALS LC ' +
            'ON LC.user_id = U.id ' +
        'WHERE U.id = $1 '
    ;
    
    search(query, searchString, false, null, [], function(results) {
        // add a value field and strip out unneeded fields
        results.forEach(function(result) {
            result.value = mergeStrings(result.name, result.username);

            result['matchingString'] = undefined;
            result['name'] = undefined;
            result['username'] = undefined;
        });

        callback(results);
   });
}


/* Searches for classes based on the class name. */
function searchClasses(searchString, limit, callback) {
    var query =
        'SELECT C.id AS data, C.class_name, U.name AS instructor, ' +
            'C.class_name AS matchingString ' +
        'FROM CLASSES C ' +
        'INNER JOIN USERS U ' +
            'ON C.instructor = U.id ' +
        'WHERE C.class_name LIKE $1 '
    ;
    
    search(query, searchString, true, limit, [], function(results) {
        // add a value field and strip out unneeded fields
        results.forEach(function(result) {
            result.value = mergeStrings(result.class_name, result.instructor);

            result['matchingString'] = undefined;
            result['class_name'] = undefined;
            result['instructor'] = undefined;
        });

        callback(results);
   });
}


/* Wraps the results as required by jQuery's autocomplete library and sends
 * it as the response.
 */
function returnResults(results, res) {
    sendBackJSON({'suggestions': results}, res);
}

/* exported library functions ----------------------------------------------*/

/* Handles all requests directed to the search service. */
exports.handleSearch = function(req, res) {
    var searchString = req.query.query;
    var searchType = req.query.type ? req.query.type : '';
    var limit = req.query.limit ? req.query.limit : null;
    var userId = common.getLoggedInUserId(req);
    
    // if the limit is negative, make it null
    if (limit < 0) {
        limit = null;
    }
    
    console.log('search for [' + searchString + '] by [' + userId +
        '] with type [' + searchType + ']; limit is [' + limit + ']');
    
    if (!searchString) {
        sendBadRequestResponse({'status': 'no search query provided'}, res);
    }
    // if a user isn't logged in and the search is for users, reject is
    else if (userId == 0 && searchType.startsWith('user')) {
        sendBadRequestResponse({'status': 'search type not allowed'}, res);
    }
    else {
        switch(searchType) {
            // default: all allowed types
            case '':
                searchClasses(searchString, null, function(classResults) {
                    // add a field to the results so that the caller knows the type
                    classResults.forEach(function(result) {
                        result.type = 'class';
                    });
                    
                    // if logged in, search users as well
                    if (userId != 0) {
                        searchUsers(searchString, null, userId, function(userResults) {
                            // add a field to the results so that the caller knows the type
                            userResults.forEach(function(result) {
                                result.type = 'user';
                            });
                            
                            // concatenate the results and sort them again
                            var results = classResults.concat(userResults);
                            sortResults(results);
                            
                            limitResults(limit, results);
                            returnResults(results, res);
                        });
                    }
                    else {
                        limitResults(classResults, limit);
                        returnResults(classResults, res);
                    }
                });
                break;
            
            case 'usersbyname':
                searchUsersByName(searchString, limit, userId, function(results) {
                    returnResults(results, res);
                });
                break;
            
            case 'usersbyusername':
                searchUsersByUsername(searchString, limit, userId, function(results) {
                    returnResults(results, res);
                });
                break;
            
            case 'users':
                searchUsers(searchString, limit, userId, function(results) {
                    returnResults(results, res);
                });
                break;
            
            case 'userbyid':
                searchForUser(searchString, function(results) {
                    returnResults(results, res);
                });
                break;
            
            case 'onlineusers':
                searchUsers(searchString, limit, userId, function(results) {
                    // next, filter out ones which are not online
                    results = results.filter(function(result) {
                        return messaging.userIsOnline(result.data);
                    });
                    
                    returnResults(results, res);
                });
                break;
            
            case 'classes':
                searchClasses(searchString, limit, function(results) {
                    returnResults(results, res);
                });
                break;
            
            default:
                sendBadRequestResponse({'status': 'unknown search type'}, res);
                break;
        }
    }
}


// used to store functions for testing purposes
exports.test = {};

/* functions exported for testing */
exports.test.scorePart = scorePart;
exports.test.compareResultScores = compareResultScores;
exports.test.sortResults = sortResults;
exports.test.limitResults = limitResults;
exports.test.mergeStrings = mergeStrings;
exports.test.mergeResults = mergeResults;
