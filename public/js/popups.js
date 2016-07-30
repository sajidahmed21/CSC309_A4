/* Sets all onclick events for the signup, login, and reference popups. */
$(document).ready(function () {
    // set events to show popups
    $('#signup_btn').click(showSignup);
    $('#userlogin_btn').click(showSignin);
    $('#reference').click(showReferences);
});


/* Destroys any existing popup. */
function hidePopup() {
    $('#popup').empty();
};


/* Redirects the user to the Google authentication page. */
function redirectToGoogleAuthentication() {
    window.location = '/auth/google';
}


/* Destroys any existing popup and then displays the references popup. */
var showReferences = function(){
    var $popup = $('#popup');
    $popup.empty();
    
    $outer = $('<div/>', {
       id:  'reference_form'
    });
    
    $middle = $('<div/>', {
       class:  'col-md-6'
    });
    
    $container = $('<div/>', {
       class:  'standard-ref-container'
    });
    
    $cancelwrapper = $('<div/>');
    
    $cancelicon = $('<span/>', {
       class:  'glyphicon glyphicon-remove cancel_icon'
    });
    $cancelicon.click(function(){
        hidePopup();
    });
    $cancelwrapper.append($cancelicon);
    
    $container.append($cancelwrapper);
    
    $form = $('<form/>');
    
    $title = $('<h1/>',{
        class : 'standard-title'
    });
    $title.text('References').appendTo($form);
    
    $ul = $('<ul/>');
    
    $ul.css('list-style-type', 'none');
    $ul.css('margin', '0');
    $ul.css('padding', '0');
    $ul.css('text-align', 'center');
    
    $li = $('<li/>',{
        class: 'standard_ref_list'
    });
    
    $li.text('Youtube. (Company). (2005). maxresdefault. [Digital image]. Retrieved from https://i.ytimg.com/vi/MWOdIIGOHGU/maxresdefault.jpg');
            
    $li.appendTo($ul);
    
    $li = $('<li/>', {
        class: 'standard_ref_list'
    });
    
    $li.text('Youtube. (Company). (2005). maxresdefault. [Digital image]. Retrieved from https://i.ytimg.com/vi/LrGPkzy6mFo/maxresdefault.jpg');
            
    $li.appendTo($ul);
    
    $li = $('<li/>',{
        class: 'standard_ref_list'
    });
    
    $li.text('boredpanda. (Website). origami-crane-paper-art-fb. [Digital image]. Retrieved from http://static.boredpanda.com/blog/wp-content/uploads/2015/10/origami-crane-paper-art-fb.jpg');
            
    $li.appendTo($ul);
    
    $ul.appendTo($form);
            
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};


/* Destroys any existing popup and then displays the signin popup. */
var showSignin = function () {
    var $popup = $('#popup');
    $popup.empty();

    $outer = $('<div/>', {
        id: 'userlogin_form'
    });

    $middle = $('<div/>', {
        class: 'col-md-6'
    });

    $container = $('<div/>', {
        class: 'standard-container'
    });

    $cancelwrapper = $('<div/>');

    $cancelicon = $('<span/>', {
        class: 'glyphicon glyphicon-remove cancel_icon'
    });
    $cancelicon.click(function () {
        hidePopup();
    });
    $cancelwrapper.append($cancelicon);

    $container.append($cancelwrapper);

    $form = $('<form method="post" action="/user/signin"/>');

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Login').appendTo($form);

    $input = $('<input/>', {
        id: 'signinUsername',
        name: 'signinUsername',
        type: 'text',
        placeholder: 'Username',
        required: 'required',
        pattern: '^[a-zA-Z0-9]{8,20}$',
        title: 'Username must be between 8 and 20 characters, and must only consist of letters and numbers.',
        class: 'standard-red-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'signinPassword',
        name: 'signinPassword',
        type: 'password',
        placeholder: 'Password',
        required: 'required',
        pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&\\-])[A-Za-z\\d$@$!%*#?&\\-]{8,20}$',
        title: 'Password must contain at least 1 letter, 1 number, 1 special character, ' +
            ' and must be between 8 and 20 characters long. Special characters include $@!%*#?&-',
        class: 'standard-red-input'
    });

    $input.appendTo($form);

    $input = $('<button/>', {
        type: 'submit',
        text: 'Login',
        class: 'btn btn-danger standard-red-button block_btn',
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        type: 'button',
        value: 'Google Login',
        class: 'btn btn-danger standard-red-button block_btn'
    });

    $input.css('margin-top', '10px');

    $input.click(redirectToGoogleAuthentication);


    $input.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
    
    // throw the focus onto the first field
    $('input#signinUsername').focus();
};


/* Destroys any existing popup and then displays the signup popup. */
var showSignup = function () {
    var $popup = $('#popup');
    $popup.empty();

    $outer = $('<div/>', {
        id: 'signup_form'
    });

    $middle = $('<div/>', {
        class: 'col-md-6'
    });

    $container = $('<div/>', {
        class: 'standard-container'
    });

    $cancelwrapper = $('<div/>');

    $cancelicon = $('<span/>', {
        class: 'glyphicon glyphicon-remove cancel_icon'
    });
    $cancelicon.click(function () {
        hidePopup();
    });
    $cancelwrapper.append($cancelicon);

    $container.append($cancelwrapper);

    $form = $('<form method="post" action="/user/signup"/>');

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Sign Up').appendTo($form);

    $input = $('<input/>', {
        id: 'signupName',
        name: 'signupName',
        type: 'text',
        placeholder: 'Your Name',
        required: 'required',
        class: 'standard-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'signupUsername',
        name: 'signupUsername',
        type: 'text',
        placeholder: 'Username',
        required: 'required',
        pattern: '^[a-zA-Z0-9]{8,20}$',
        title: 'Username must be between 8 and 20 characters, and must only consist of letters and numbers.',
        class: 'standard-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'signupPassword',
        name: 'signupPassword',
        type: 'password',
        placeholder: 'Password',
        required: 'required',
        pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&\\-])[A-Za-z\\d$@$!%*#?&\\-]{8,20}$',
        title: 'Password must contain at least 1 letter, 1 number, 1 special character, ' +
            ' and must be between 8 and 20 characters long. Special characters include $@!%*#?&-',
        class: 'standard-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'userPasswordConfirm',
        name: 'userPasswordConfirm',
        type: 'password',
        placeholder: 'Password Comfirmation',
        required: 'required',
        pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&\\-])[A-Za-z\\d$@$!%*#?&\\-]{8,20}$',
        title: 'Password must contain at least 1 letter, 1 number, 1 special character, ' +
            ' and must be between 8 and 20 characters long. Special characters include $@!%*#?&-',
        class: 'standard-input'
    });

    $input.appendTo($form);

    $div = $('<div/>', {
        id: 'signup-error-message',
        class: 'invis'
    });

    $div.text('Your passwords do not match')
    $div.appendTo($form);

    $input = $('<button/>', {
        type: 'submit',
        text: 'Join Now!',
        class: 'standard-blue-button block_btn',
    });

    $input.appendTo($form);

    $form.submit(validateSignup);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
    
    // throw the focus onto the first field
    $('input#signupName').focus();
};


/* Called when the user submits a signup request by validating input and adds
 * any error message to the error dialogue area.
 *
 * Returns true if the validation was successful, or false otherwise.
 */
function validateSignup(form) {
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