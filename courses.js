var common = require('./common');
var sequelize = require('sequelize');
var db = common.db;

var notifications = require('./notifications');

// TODO: 
// SUPPORT ADDING COMMENT FUNCTIONALITY
// ARE WE GOING TO ALLOW GUESTS TO COMMENT? 
// WHO CAN COMMENT? ANY LOGGED IN USER OR SOMEONE THAT IS IN THE COURSE?
// WHERE WILL COURSE POSTS GO? NEED TO SUPPORT THAT FUNCTIONALITY
// NEED TO SUPPORT BASIC INFO ABOUT COURSE LIKE COURSE DESCRIPTION AND REQUIREMENTS
// NEED TO SUPPORT RATING FUNCTIONALITY (STARS LIGHTING UP ETC)
// USERNAMES MUST BE UNIQUE, NOT CURRENTLY THE CASE IN DATABASE
var colors = ['#b6cde3',  '#b6e2e3', '#b6e3d2', '#b6e3c6',  '#bbe3b6',  '#c9e3b6' ,  '#dae3b6',  '#e3d7b6',  '#e3c5b6',  '#e3b6d6',  '#dab6e3',  '#c0b6e3'];
exports.get_class_info = function(req, res, next) {
		db.query('SELECT C.id, U.name as instructor, C.class_name, C.banner_picture_path, C.created_timestamp'
		+' FROM CLASSES C, USERS U  WHERE C.id= $1 AND U.id = C.instructor',
	 	{ bind: [req.params.id], type: sequelize.QueryTypes.SELECT }
	 	).then(function(class_info) {
	 		if (class_info.length > 0) {
	 			res.class_info = class_info; // format: [{id:, instructor, ...}]
	 			next();
	 		} else {
	 			res.send('No such course'); // maybe custom page
	 		}
	 	})
	 	.catch(function(err) {
	 		console.log("query failed");
	 		res.send('404');
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
	 		res.send('404');
	 	})
}

exports.get_enrolled_students = function(req, res, next) {
		db.query('SELECT U.name as student FROM ENROLMENT E, USERS U where E.class_id = $1 AND U.id = E.user_id', 
			{ bind: [res.class_info[0].id]}
			).spread(function(results, metadata) {
				res.enrolled_students = [];
				for (i=0; i < results.length; i++) {
						res.enrolled_students[i] = results[i].student;
				}
				next();
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		res.send('404');
	 	})
}

exports.get_reviews = function(req, res, next) {
	db.query('SELECT' 
			+' U.name as username, U.profile_picture_path as dp, R.content as review, R.rating as rating, R.created_timestamp as postdate' 
			+ ' FROM REVIEWS R, USERS U WHERE R.class_id = $1 AND U.id = R.user_id ORDER BY R.created_timestamp ASC;', 
			{ bind: [res.class_info[0].id]}
			).spread(function(results, metadata) {

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
	 		res.send('404');
	 	})
} 
/* res.rating, res.class_info */
exports.render_course_page = function(req, res, next) {
	console.log(res.class_info[0]);
	console.log(res.enrolled_students);
	console.log(res.rating);
	console.log(res.reviews);
	if (res.class_info[0].class_name.length > 20) {
		titlefont = "4vw";
	} else if (res.class_info[0].class_name.length > 16) {
		titlefont = "4vw";
	} else {
		titlefont = "5vw";
	}
		res.render('coursedesc', {
			loggedIn: common.userIsLoggedIn(req),
			imgPath: res.class_info[0].banner_picture_path,
			titlefont: titlefont,
			courseTitle: res.class_info[0].class_name,
			instructor: res.class_info[0].instructor,
			rating: res.rating,
			enrollment: res.enrolled_students.length,
			courseDesc: "this is course description", // need this in database
			courseRequirements: "this is course requirements", // need this in database
			students: res.enrolled_students,
			reviews: res.reviews
		}); 
}


/* Handles requests to enroll in a class. */
exports.enrollHandler = function (req, res) {
    if (!common.userIsLoggedIn(req)) {
        common.sendUnauthorizedResponse({
            status: 'ERROR', 
            message: 'not logged in'
        }, res);
    }
    // check that the class id is provided
    else if (!req.body.classId) {
        common.sendBadRequestResponse({
            status: 'ERROR',
            message: 'missing classId'
        }, res);
    }
    // check that the class id is a valid integer
    else if (req.body.classId <= 0) {
        common.sendBadRequestResponse({
            status: 'ERROR',
            message: 'invalid classId'
        }, res);
    }
    // valid integer
    else {
        // check that the class actually exists
        var classId = req.body.classId;
        
        var classExistsQuery =
            'SELECT COUNT(*) AS count ' +
            'FROM CLASSES ' +
            'WHERE id = $1 '
        ;
        
        db.query(classExistsQuery, { bind: [classId] })
        .spread(function(results, metadata) {
            console.log(results);
            // if no class with that id exists, this was a bad request
            if (results[0].count == 0 ) {
                common.sendBadRequestResponse({
                    status: 'ERROR',
                    message: 'invalid classId'
                }, res);
            }
            // otherwise, check if already enrolled
            else {
                var userId = common.getLoggedInUserId(req);
                
                var alreadyEnrolledQuery =
                    'SELECT user_id ' +
                    'FROM ENROLMENT ' +
                    'WHERE user_id = $1 AND class_id = $2 '
                ;
                
                db.query(alreadyEnrolledQuery, { bind: [userId, classId] })
                .spread(function(results, metadata) {
                    // if there is already an enrollment
                    if (results.length !== 0 ) {
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
                })
                .catch(function(err) {
                    console.log(err);
                    common.sendInternalServerErrorResponse(res);
                });
            }
        })
        .catch(function(err) {
            console.log(err);
            common.sendInternalServerErrorResponse(res);
        });
    }
};