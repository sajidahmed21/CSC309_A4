var common = require('./common');
var recommendations = require('./recommendations');
var notifications = require('./notifications');


function renderPage(req, res, errorContent, popularClasses, recommendedClasses, notifications) {
    res.render('home', {
        loggedIn: common.userIsLoggedIn(req),
        errorContent: errorContent,
        popularClasses: popularClasses,
        recommendedClasses: recommendedClasses,
        notifications: notifications
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
            var userId = common.getLoggedInUserId(req);
            recommendations.recommendedClasses(userId, 6, function(err, recommendedClasses) {
                if (err) {
                    // even if we fail, try to load notifications
                    notifications.recentNotifications(userId, 10, function(err, notifications) {
                        if (err) {
                            console.log(err);
                            renderPage(req, res, '<p><strong>Oh no!</strong> We couldn\'t load notifications or recommended classes for you.</p>', popularClasses);
                        }
                        else {
                            console.log(err);
                            renderPage(req, res, '<p><strong>Oh no!</strong> We couldn\'t load recommended classes for you.</p>', popularClasses);
                        }
                    });
                }
                else {
                    // finally, load the notification feed
                    notifications.recentNotifications(userId, 10, function(err, notifications) {
                        if (err) {
                            console.log(err);
                            var errorContent = '<p><strong>Doh!</strong> We weren\'t able to load your notification feed.';
                            renderPage(req, res, errorContent, popularClasses, recommendedClasses, null);
                        }
                        else {
                            renderPage(req, res, null, popularClasses, recommendedClasses, notifications);
                        }
                    });
                }
            });
        }
        else {
            renderPage(req, res, null, popularClasses);
        }
    });
}