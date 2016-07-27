// server side validation
var common = require('./common');
var db = common.db;


/*replace 1 with getLoggedInUserId(req)*/
exports.validate = function(req, res, next) {
    var courseTitle = formatTitle(req.body.courseTitle);
    var num_errors = 0;
    if (req.file) { // if not using default image
        if (!hasGoodSize(req.file.size) || !isImage(req.file.mimetype)) {
                    res.courseBannerErr = "File too large or not an image";
                    num_errors++;
        }
    }
    console.log("res.bannerpath in alreadyInDb: "+res.bannerpath);
    db.query('SELECT * FROM CLASSES WHERE class_name =$1 AND instructor = $2', 
            { bind: [courseTitle, common.getLoggedInUserId(req)]}
            ).spread(function(results, metadata) {
                    if (results.length > 0) {
                        res.courseTitleErr = "Course with that name already exists";
                        num_errors++;
                    }
                   if (num_errors > 0) {
                    res.render('createcourse', {
                            loggedIn:  true,
                            courseBannerErr: res.courseBannerErr,
                            courseTitle: req.body.courseTitle,
                            courseReqs: req.body.courseReqs,
                            courseDesc: req.body.courseDesc,
                            courseTitleErr: res.courseTitleErr
                            });    
                            return;
                   } else {
                    next();
                   }
            })
            .catch(function(err) {
            console.log("query failed");
        })
}
exports.addClassInfoAndRedirect = function(req, res) {
    console.log("res.bannerpath in redirect: "+res.bannerpath);
        var courseTitle = formatTitle(req.body.courseTitle);
        var courseDesc = formatDesc(req.body.courseDesc);
        var courseReqs = formatReqs(req.body.courseReqs);
	db.query('INSERT INTO CLASSES (class_name, instructor, banner_picture_path) VALUES ($1, $2, $3)', 
			{ bind: [courseTitle, common.getLoggedInUserId(req), res.bannerpath.slice(6)]}
			).spread(function(results, metadata) {
					console.log(results);
					console.log(metadata);
					res.redirect(303, "/course/"+metadata.lastID);
			})
			.catch(function(err) {
	 		console.log("query failed");
	 		res.send(err);
	 	})
}
exports.hasGoodDimensions = function(value) {
            // how to do this? 
                return true;
}

function hasGoodSize(value) {
            // Validation here:
            return value < 2000000; // banner img less than 2mb size. 
}

function isImage(value) {
            // Validation here:
           pattern = /image(\/jpg$ |\/gif$|\/png$|\/jpeg$)/i;
           return pattern.test(value);
}

function capitalizeFirstChar(str) {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeEveryElement(array) {
	var str = '';
	for (i = 0; i < array.length; i++) {
		if (i > 0) {
			str += " " + capitalizeFirstChar(array[i]);
		} else {
		     str += capitalizeFirstChar(array[i]);
		}
	}
	return str;
}
function formatTitle(title) {
	var array = title.split(" ");
	return capitalizeEveryElement(array);
}
function formatDesc(desc) {
    var array = desc.split(".");
    return capitalizeEveryElement(array);
}

function formatReqs(reqs) {
	var array = reqs.split(".");
	return capitalizeEveryElement(array);
}