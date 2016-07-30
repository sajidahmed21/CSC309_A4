var common = require('./common');
var sequelize = require('sequelize');
var db = common.db;

var notifications = require('./notifications');
var colors = ['#b6cde3',  '#b6e2e3', '#b6e3d2', '#b6e3c6',  '#bbe3b6',  '#c9e3b6' ,  '#dae3b6',  
                '#e3d7b6',  '#e3c5b6',  '#e3b6d6',  '#dab6e3',  '#c0b6e3'];
exports.get_class_info = function(req, res, next) {
		db.query('SELECT C.id, U.name as instructor, C.class_name, C.banner_picture_path, C.coursedesc, C.coursereqs, C.created_timestamp'
		+' FROM CLASSES C, USERS U  WHERE C.id= $1 AND U.id = C.instructor',
	 	{ bind: [req.params.id], type: sequelize.QueryTypes.SELECT }
	 	).then(function(class_info) {
	 		if (class_info.length > 0) {
	 			res.class_info = class_info; // format: [{id:, instructor, ...}]
	 			next();
	 		} else {
	 			return res.send('No such course'); // maybe custom page
	 		}
	 	})
	 	.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})
}


exports.get_course_rating = function(req, res, next) {
	db.query('SELECT avg(rating) as avg_rating, count(*) as num_rating FROM REVIEWS WHERE class_id = $1',
	 	{ bind: [res.class_info[0].id], type: sequelize.QueryTypes.SELECT }
	 	).then(function(rating) {
	 		var num_rating = rating[0].num_rating;
	 		var avg_rating = rating[0].avg_rating;
	 		if (num_rating == 0) { // nobody has rated/reviewed the course
	 			res.rating = "No Ratings Yet";
	 		} else {
	 			res.rating = avg_rating + "/5 ("+num_rating+ " rating(s))";
	 		}
	 		next();
	 	})
	 	.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})
}

exports.get_enrolled_students = function(req, res, next) {
		db.query('SELECT U.name as student, U.id FROM ENROLMENT E, USERS U where E.class_id = $1 AND U.id = E.user_id', 
			{ bind: [res.class_info[0].id]}
			).spread(function(results, metadata) {
				res.enrolled_students = results;
				next();
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})
}

exports.get_reviews = function(req, res, next) {
	db.query('SELECT' 
			+' U.name as username, U.profile_color as dp, R.user_id AS review_id, R.content as review, R.rating as rating, R.created_timestamp as postdate' 
			+ ' FROM REVIEWS R, USERS U WHERE R.class_id = $1 AND U.id = R.user_id ORDER BY R.created_timestamp ASC;', 
			{ bind: [res.class_info[0].id]}
			).spread(function(results, metadata) {
				// circular avatars
				for (i = 0; i < results.length; i++) {
					var username = results[i].username;
					results[i].firstLetter = username.charAt(0).toUpperCase();
					results[i].dp = colors[username.charCodeAt(0) % colors.length];
				}
				res.reviews = results;
				next();
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})
} 

exports.get_posts = function(req, res, next) {
    db.query('SELECT content as post, created_timestamp as timestamp FROM INSTRUCTOR_POSTS WHERE class_id = $1 ORDER BY timestamp ASC', 
            { bind: [req.params.id]}
            ).spread(function(results, metadata) {
                // circular avatars
                res.posts = []
                if (results.length == 0) {
                    res.anyposts = false;
                } else {
                    res.anyposts = true;
                    res.posts = results;
                }
                next();
            })
            .catch(function(err) {
            console.log("query failed");
            common.sendInternalServerErrorResponse(res);
        })
}


// get info about logged in user
exports.hasLoggedInUserReviewed = function(req, res, next) {
	// is there a user logged in? 
	if (common.userIsLoggedIn(req)) {
		// let's get info about them 
		// have they already reviewed the course? 
		db.query('SELECT * FROM REVIEWS WHERE user_id = $1 AND class_id = $2', 
				{ bind: [common.getLoggedInUserId(req), req.params.id]}
				).spread(function(results, metadata) {
					// already reviewed the course
				 if (results.length > 0) {
				 		res.reviewed = true;
				 } else { // haven't reviewed the course
				 	res.reviewed = false;
				 }
				 next();
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})
	} else {
		res.reviewed = false;
		next();
	}
} 

exports.isLoggedInUserEnrolled = function(req, res, next) {
	if (common.userIsLoggedIn(req)) { 
		// get the instructor id
		db.query('SELECT * FROM ENROLMENT WHERE user_id = $1 AND class_id = $2', 
				{ bind: [common.getLoggedInUserId(req), req.params.id]}
				).spread(function(results, metadata) {
				 if (results.length == 1) { // enrolled
				 	res.enrolled = true;
				 } else {
				 	res.enrolled = false;
				 }
				 next();
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})
	} else { 
	// not logged in user can't be enrolled
	res.enrolled = false;
	next();
	}
}
exports.isLoggedInUserInstructor= function(req, res, next) {
	if (common.userIsLoggedIn(req)) { 
		db.query('SELECT instructor FROM CLASSES WHERE id = $1', 
				{ bind: [req.params.id]}
				).spread(function(results, metadata) {
				 if (common.getLoggedInUserId(req) == results[0].instructor) {
				 	res.isInstructor = true;
				 } else {
				 	res.isInstructor = false;
				 }
				 next();
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})
	} else {
		// should not get to this in handlebars, 
		// 
		res.isInstructor = false;
		next();	
	}
}

exports.getLoggedInUserAvatar = function(req, res, next) {
			// logged in urser hasn't reviewed and isn't instructor
	if (common.userIsLoggedIn(req) && (!res.reviewed) && (!res.instructor)) {
		db.query('SELECT name as username FROM USERS WHERE id = $1', 
				{ bind: [common.getLoggedInUserId(req)] }
				).spread(function(results, metadata) {
					var username = results[0].username;
					res.LIfirstLetter = username.charAt(0).toUpperCase();
					res.LIbackgroundColor = colors[(username.charCodeAt(0) + username.length) % colors.length];
					res.LIname = username;
					next();
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		common.sendInternalServerErrorResponse(res);
	 	})	
	} else {
		// don't need to set these, but just in case
		res.LIfirstLetter = null;
		res.LIbackgroundColor = null;
		res.LIname = null;
		next();
	}	
}
/* res.rating, res.class_info */
exports.render_course_page = function(req, res, next) {
	console.log(res.enrolled);
	console.log(res.reviewed);
	console.log(res.isInstructor);
	if (res.class_info[0].class_name.length > 20) {
		titlefont = "3vw";
	} else if (res.class_info[0].class_name.length > 16) {
		titlefont = "4vw";
	} else {
		titlefont = "5vw";
	}
        
        renderCoursePage(req, res);
}

function renderCoursePage(req, res) {
	//res.render('coursedesc', {
        var values = {
                anyposts: res.anyposts,
                posts: res.posts,
                enrolled: res.enrolled,
                Reviewed: res.reviewed,
                LIname: res.LIname,
                isInstructor: res.isInstructor,
                LIfirstLetter: res.LIfirstLetter,
                LIbackgroundColor: res.LIbackgroundColor,
                loggedIn: common.userIsLoggedIn(req),
                imgPath: res.class_info[0].banner_picture_path,
                titlefont: titlefont,
                courseTitle: res.class_info[0].class_name,
                instructor: res.class_info[0].instructor,
                rating: res.rating,
                enrollment: res.enrolled_students.length,
                courseDesc: res.class_info[0].coursedesc, // need this in database
                courseRequirements: res.class_info[0].coursereqs, // need this in database
                students: res.enrolled_students,
                reviews: res.reviews
        };
        
        /* Render the edit course admin page if the request originated from an admin */
        if (req.url.startsWith('/admin/edit_course') && req.session.adminId !== undefined) {
                values.adminUsername = req.session.adminId;
                res.render('edit_course_admin', values);
        }
        // Else render the course page for users / instructors
        else {
                res.render('coursedesc', values);
        }
}



/* Fetches the instructor for a class and calls the callback.
 *
 * Note that the callback is called with the error information, if any, 
 * and the results if successful.
 */
function fetchInstructor(classId, callback) {
    var query =
        'SELECT instructor ' +
        'FROM CLASSES ' +
        'WHERE id = $1 '
    ;
    
    db.query(query, { bind: [classId] })
    .spread(function(results, metadata) {
        if (results[0] && results[0].instructor) {
            callback(null, results[0].instructor);
        }
        else {
            callback('Class not found.', null);
        }
    })
    .catch(function(err) {
        callback(err, null);
    });
}


/* Deterines whether the given user is enrolled in a given class and calls
 * the callback.
 *
 * Note that the callback is called with the error information, if any,
 * and the results if successful.
 */
function isEnrolledIn(userId, classId, callback) {
    var query =
        'SELECT COUNT(*) as count ' +
        'FROM ENROLMENT ' +
        'WHERE user_id = $1 AND class_id = $2 '
    ;
    
    db.query(query, { bind: [userId, classId] })
    .spread(function(results, metadata) {
        if (results[0] && results[0].count > 0) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    })
    .catch(function(err) {
        callback(err, null);
    });
}


/* Deterines whether the given class exists and calls the callback.
 *
 * Note that the callback is called with the error information, if any,
 * and the results if successful.
 */
function doesClassExist(classId, callback) {
    var query =
        'SELECT COUNT(*) as count ' +
        'FROM CLASSES ' +
        'WHERE id = $1 '
    ;
    
    db.query(query, { bind: [classId] })
    .spread(function(results, metadata) {
        if (results[0] && results[0].count > 0) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    })
    .catch(function(err) {
        callback(err, null);
    });
}
exports.editCourseDescHandler = function(req, res) {
        
        // make sure user is instructor
        // make sure class_id is valid

        var courseDesc = req.body.coursedesc;
        var class_id = req.body.class_id;
        var userId = common.getLoggedInUserId(req)
        // make sure user is logged in 
        if (!common.userIsLoggedIn(req)) {
        common.sendUnauthorizedResponse({
            status: 'ERROR', 
            message: 'not logged in'
        }, res);
        } else {
            doesClassExist(class_id, function(err, exists) {
                if (err) {
                    console.log(err);
                    common.sendInternalServerErrorResponse(res);
                } else if (!exists){
                    common.sendBadRequestResponse({
                                status: 'ERROR',
                                message: 'Cannot change course description of non-existent class'
                            }, res);
                } else { // class exists
                    fetchInstructor(class_id, function(err, instructorId) {
                            if (err) {
                                console.log(err);
                                common.sendInternalServerErrorResponse(res);
                            } else if (instructorId != userId) {
                                common.sendBadRequestResponse({
                                status: 'ERROR',
                                message: 'Only instructor can change course description'
                            }, res);
                            } else { // user is instructor, so update course description
                                 var query =
                                        'UPDATE CLASSES SET coursedesc = $1 WHERE id = $2' 
                                    ;

                                    db.query(query, { bind: [courseDesc, class_id] })
                                    .spread(function(results, metadata) {
                                        common.sendBackJSON({status: 'SUCCESS'}, res);
                                    })
                                    .catch(function(err) {
                                        console.log(err);
                                        common.sendInternalServerErrorResponse(res);
                                    })
                            }
                    })
                }       
            })
        }
}


exports.editCourseReqsHandler = function(req, res) {
         // make sure user is instructor
        // make sure class_id is valid

        var courseReqs = req.body.coursereqs;
        var class_id = req.body.class_id;
        var userId = common.getLoggedInUserId(req)
        // make sure user is logged in 
        if (!common.userIsLoggedIn(req)) {
            common.sendUnauthorizedResponse({
                status: 'ERROR', 
                message: 'not logged in'
            }, res);
        } else {
            doesClassExist(class_id, function(err, exists) {
                if (err) {
                    console.log(err);
                    common.sendInternalServerErrorResponse(res);
                } else if (!exists){
                    common.sendBadRequestResponse({
                                status: 'ERROR',
                                message: 'Cannot change course requirements of non-existent class'
                            }, res);
                } else { // class exists
                    fetchInstructor(class_id, function(err, instructorId) {
                            if (err) {
                                console.log(err);
                                common.sendInternalServerErrorResponse(res);
                            } else if (instructorId != userId) {
                                common.sendBadRequestResponse({
                                status: 'ERROR',
                                message: 'Only instructor can change course requirements'
                            }, res);
                            } else { // user is instructor, so update course description
                                 var query =
                                        'UPDATE CLASSES SET coursereqs = $1 WHERE id = $2' 
                                    ;
                                    db.query(query, { bind: [courseReqs, class_id] })
                                    .spread(function(results, metadata) {
                                        common.sendBackJSON({status: 'SUCCESS'}, res);
                                    })
                                    .catch(function(err) {
                                        console.log(err);
                                        common.sendInternalServerErrorResponse(res);
                                    })
                            }

                    })
                }       
            })
    }
}
exports.unenrollHandler = function (req, res) {
    var classId = req.body.class_id;
    var userId = common.getLoggedInUserId(req)
    
    if (!common.userIsLoggedIn(req)) {
        common.sendUnauthorizedResponse({
            status: 'ERROR', 
            message: 'not logged in'
        }, res);
    }
    // check that the class id is provided
    else if (!classId) {
        common.sendBadRequestResponse({
            status: 'ERROR',
            message: 'missing classId'
        }, res);
    }
    // check that the class id is a valid integer
    else if (classId <= 0) {
        common.sendBadRequestResponse({
            status: 'ERROR',
            message: 'invalid classId'
        }, res);
    }
    else {
        // check if the class actually exists
        doesClassExist(classId, function(err, exists) {
            if (err || !exists) {
                console.log(err);
                common.sendBadRequestResponse({
                    status: 'ERROR',
                    message: 'invalid classId'
                }, res);
            }
            else {
                // check if the user is the instructor
                fetchInstructor(classId, function(err, instructorId) {
                    // there should always be an instructor
                    if (err) {
                        console.log(err);
                        common.sendInternalServerErrorResponse(res);
                    }
                    else if (instructorId == userId) {
                        common.sendBadRequestResponse({
                            status: 'ERROR',
                            message: 'cannot unenrol in one\'s own class'
                        }, res);
                    }
                    else {
                        // check if the user is already enrolled
                        isEnrolledIn(userId, classId, function(err, alreadyEnrolled) {
                            // we should always be able to determine if the user was enrolled
                            if (err) {
                                console.log(err);
                                common.sendInternalServerErrorResponse(res);
                            }
                            else if (alreadyEnrolled) { // can delete user now
                                var query =
                                    'DELETE FROM ENROLMENT WHERE user_id= $1 AND class_id = $2' 
                                ;

                                db.query(query, { bind: [userId, classId] })
                                .spread(function(results, metadata) {
                                    // add notifications, but don't worry about the result

                                    // *** notify of removal from course ? *** //

                                    common.sendBackJSON({status: 'SUCCESS'}, res);
                                })
                                .catch(function(err) {
                                    console.log(err);
                                    common.sendInternalServerErrorResponse(res);
                                })
                            }
                        });
                    }
                });
            }
        });
    }
};


/* Handles requests to enroll in a class. */
exports.enrollHandler = function (req, res) {
    var classId = req.body.class_id;
    var userId = common.getLoggedInUserId(req)
    
    if (!common.userIsLoggedIn(req)) {
        common.sendUnauthorizedResponse({
            status: 'ERROR', 
            message: 'not logged in'
        }, res);
    }
    // check that the class id is provided
    else if (!classId) {
        common.sendBadRequestResponse({
            status: 'ERROR',
            message: 'missing classId'
        }, res);
    }
    // check that the class id is a valid integer
    else if (classId <= 0) {
        common.sendBadRequestResponse({
            status: 'ERROR',
            message: 'invalid classId'
        }, res);
    }
    else {
        // check if the class actually exists
        doesClassExist(classId, function(err, exists) {
            if (err || !exists) {
                console.log(err);
                common.sendBadRequestResponse({
                    status: 'ERROR',
                    message: 'invalid classId'
                }, res);
            }
            else {
                // check if the user is the instructor
                fetchInstructor(classId, function(err, instructorId) {
                    // there should always be an instructor
                    if (err) {
                        console.log(err);
                        common.sendInternalServerErrorResponse(res);
                    }
                    else if (instructorId == userId) {
                        common.sendBadRequestResponse({
                            status: 'ERROR',
                            message: 'cannot enrol in one\'s own class'
                        }, res);
                    }
                    else {
                        // check if the user is already enrolled
                        isEnrolledIn(userId, classId, function(err, alreadyEnrolled) {
                            // we should always be able to determine if the user was enrolled
                            if (err) {
                                console.log(err);
                                common.sendInternalServerErrorResponse(res);
                            }
                            else if (alreadyEnrolled) {
                                common.sendBadRequestResponse({
                                    status: 'ERROR',
                                    message: 'already enrolled'
                                }, res);
                            }
                            // otherwise, we can enrol the user
                            else {
                                var query =
                                    'INSERT INTO ENROLMENT(user_id, class_id) ' +
                                    'VALUES($1, $2) '
                                ;

                                db.query(query, { bind: [userId, classId] })
                                .spread(function(results, metadata) {
                                    // add notifications, but don't worry about the result
                                    notifications.notifyOfClassEnrollment(userId, classId);
                                    common.sendBackJSON({status: 'SUCCESS'}, res);
                                })
                                .catch(function(err) {
                                    console.log(err);
                                    common.sendInternalServerErrorResponse(res);
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};
exports.checkLoggedIn = function(req, res, next) {
    var class_id = req.body.class_id;
    var user_id= common.getLoggedInUserId(req);
    var post = req.body.post;
    if (!common.userIsLoggedIn(req)) {
        common.sendUnauthorizedResponse({
            status: 'ERROR', 
            message: 'not logged in'
        }, res);
    } else {
        next();
    }
}
exports.classExists = function(req, res, next) {
    var class_id = req.body.class_id;
    var user_id= common.getLoggedInUserId(req);
    var post = req.body.post;
    db.query('SELECT * FROM CLASSES WHERE id = $1', 
                    { bind: [class_id] }
                    ).spread(function(results, metadata) {
                        if (results.length == 1) {
                            next();
                        } else {
                            //shouldn't happen
                            common.sendInternalServerErrorResponse(res);
                        }
            })
            .catch(function(err) {
            console.log("query failed");
            common.sendInternalServerErrorResponse(res);
            }) 
}
exports.isInstructor = function(req, res, next) {
    var class_id = req.body.class_id;
    var user_id= common.getLoggedInUserId(req);
    var post = req.body.post;
   fetchInstructor(class_id, function(err, instructorId) {
                // there should always be an instructor
                if (err) {
                    console.log(err);
                    common.sendInternalServerErrorResponse(res);
                }
                else if (instructorId != user_id) {
                    common.sendBadRequestResponse({
                        status: 'ERROR',
                        message: 'Only instructor can make a post'
                    }, res);
                } else if (!post) {
                    common.sendBadRequestResponse({
                        status: 'ERROR',
                        message: 'Post cannot be null'
                    }, res);
                } else { // everything is good
                    db.query('INSERT INTO INSTRUCTOR_POSTS (class_id, content) VALUES ($1, $2)', 
                    { bind: [class_id, post] }
                     ).spread(function(results, metadata) {
                        common.sendBackJSON({status: 'SUCCESS'}, res);
                     })
                    .catch(function(err) {
                    console.log("query failed");
                    common.sendInternalServerErrorResponse(res);
                })  
            }
            });
}

