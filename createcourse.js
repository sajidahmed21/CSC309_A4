// server side validation
var common = require('./common');
var db = common.db;
//testing
exports.test = {};
exports.test.isImage = isImage;

/*replace 1 with getLoggedInUserId(req)*/
exports.validate = function (req, res, next) {
    var courseTitle = req.body.courseTitle;
    var num_errors = 0;
    if (req.file) { // if not using default image
        if (!hasGoodSize(req.file.size) || !isImage(req.file.mimetype)) {
            res.courseBannerErr = "File too large or not an image";
            num_errors++;
        }
    }
    console.log("res.bannerpath in alreadyInDb: " + res.bannerpath);
    db.query('SELECT * FROM CLASSES WHERE class_name =$1 AND instructor = $2', {
            bind: [courseTitle, common.getLoggedInUserId(req)]
        }).spread(function (results, metadata) {
            if (results.length > 0) {
                res.courseTitleErr = "Course with that name already exists";
                num_errors++;
            }
            if (num_errors > 0) {
                res.render('createcourse', {
                    loggedIn: true,
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
        .catch(function (err) {
            console.log("query failed");
        })
}
exports.addClassInfoAndRedirect = function (req, res) {
    console.log("res.bannerpath in redirect: " + res.bannerpath);
    var courseTitle = req.body.courseTitle;
    var courseDesc = req.body.courseDesc;
    var courseReqs = req.body.courseReqs;


    db.query('INSERT INTO CLASSES (class_name, instructor, coursedesc, coursereqs, banner_picture_path) VALUES ($1, $2, $3, $4, $5)', {
            bind: [courseTitle, common.getLoggedInUserId(req), courseDesc, courseReqs, res.bannerpath]
        }).spread(function (results, metadata) {
            console.log(results);
            console.log(metadata);
            res.redirect(303, "/course/" + metadata.lastID);
        })
        .catch(function (err) {
            console.log("query failed");
            res.send(err);
        })
}
exports.hasGoodDimensions = function (value) {
    // how to do this? 
    return true;
}

function hasGoodSize(value) {
    // Validation here:
    return value < 2000000; // banner img less than 2mb size. 
}

function isImage(value) {
    // Validation here:
    pattern = /image(\/jpg$ |\/gif$|\/png$|\/jpeg$|\/bmp$)/i;
    return pattern.test(value);
}

exports.test = {};
exports.test.isImage = isImage;