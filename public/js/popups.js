/* Sets all onclick events for the signup, login, and reference popups. */
$(document).ready(function () {
    // hide popups on load
    hidePopups();
    
    // set events to show popups
    $('#signup_btn').click(showSignup);
    $('#userlogin_btn').click(showSignin);
    $('#reference').click(showReferences);
    
    // attach an onclick onto all cancel icons
    $('div#popups .cancel_icon').click(hidePopups);
    
    // redirection for Google
    $('button#googleLogin').click(redirectToGoogleAuthentication);
    
    // hide the signup error box
    $('#signup-error-message').hide();
    
    // attach form submition events
    $('form#signup-popup').submit(onSignup);
});


/* Hides all popups. */
function hidePopups() {
    $('form#signin-popup').hide();
    $('form#signup-popup').hide();
    $('div#references-popup').hide();
};


/* Redirects the user to the Google authentication page. */
function redirectToGoogleAuthentication() {
    window.location = '/auth/google';
}


/* Hides all popups and then displays the references popup. */
var showReferences = function(){
    hidePopups();
    $('div#references-popup').show();
};


/* Hides all popups and then displays the signin popup. */
var showSignin = function () {
    hidePopups();
    $('form#signin-popup').show();
    
    // throw the focus onto the first field
    $('input#signinUsername').focus();
};


/* Hides all popups and then displays the signup popup. */
var showSignup = function () {
    hidePopups();
    $('form#signup-popup').show();
    
    // throw the focus onto the first field
    $('input#signupName').focus();
};


/* Handles when the user submits a signup request by validating input
 * and making an AJAX call if everything is valid.
 */
function onSignup(form) {
    var $error = $('#signup-error-message');
    
    // hide any existing error
    $error.hide();
    
    // fetch form variables
    var name = $('#signupName').val();
    var username = $('#signupUsername').val();
    var password = $('#signupPassword').val();
    var passwordConfirmation = $('#userPasswordConfirm').val();
    
    if (password !== passwordConfirmation) {
        $error.text('Opps! The passwords don\'t match.');
        $error.show();
    }
    else if (name = '') {
        $error.text('A name is required to signup.');
        $error.show();
    }
    else if (username = '' || username.length < 8) {
        $error.text('A username of at least eight characters must be provided.');
        $error.show();
    }
    // everything validated successfully, so submit the form
    else {
        return true;
    }
    
    // return false so that the form submission doesn't occur
    return false;
}