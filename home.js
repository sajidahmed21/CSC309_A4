var common = require('./common');
var recommendations = require('./recommendations');


function renderPage(req, res, errorContent, popularCourses, recommendedCourses) {
    res.render('home', {
        loggedIn: common.userIsLoggedIn(req),
        errorContent: errorContent,
        popularCourses: popularCourses,
        popularWellColumnSize: popularCourses ? 12 / popularCourses.length : 12,
        recommendedCourses: recommendedCourses,
        recommendedWellColumnSize: recommendedCourses ? 12 / recommendedCourses.length : 12
    });
}


exports.render = function(req, res, errorContent) {
    // retrieve the popular courses and if a user is logged in, the recommended courses
    recommendations.popularCourses(function(err, popularCourses) {
        if (err) {
            console.log(err);
            renderPage(req, res, '<p><strong>Oh no!</strong> We couldn\'t load the popular courses.</p>');
        }
        else if (common.userIsLoggedIn(req)) {
            recommendations.recommendedCourses(common.getLoggedInUserId(req), function(err, recommendedCourses) {
                if (err) {
                    console.log(err);
                    renderPage(req, res, '<p><strong>Oh no!</strong> We couldn\'t load recommended courses for you.</p>', popularCourses);
                }
                else {
                    renderPage(req, res, null, popularCourses, recommendedCourses);
                }
            });
        }
        else {
            renderPage(req, res, null, popularCourses);
        }
    });
}