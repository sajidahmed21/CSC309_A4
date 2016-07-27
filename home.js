var common = require('./common');
var recommendations = require('./recommendations');


function renderPage(req, res, errorContent, popularClasses, recommendedClasses) {
    res.render('home', {
        loggedIn: common.userIsLoggedIn(req),
        errorContent: errorContent,
        popularClasses: popularClasses,
        recommendedClasses: recommendedClasses
    });
}


exports.render = function(req, res, errorContent) {
    // retrieve the popular courses and if a user is logged in, the recommended courses
    recommendations.popularClasses(6, function(err, popularClasses) {
        if (err) {
            console.log(err);
            renderPage(req, res, '<p><strong>Oh no!</strong> We couldn\'t load the popular courses.</p>');
        }
        else if (common.userIsLoggedIn(req)) {
            recommendations.recommendedClasses(common.getLoggedInUserId(req), 6, function(err, recommendedClasses) {
                if (err) {
                    console.log(err);
                    renderPage(req, res, '<p><strong>Oh no!</strong> We couldn\'t load recommended classes for you.</p>', popularClasses);
                }
                else {
                    renderPage(req, res, null, popularClasses, recommendedClasses);
                }
            });
        }
        else {
            renderPage(req, res, null, popularClasses);
        }
    });
}