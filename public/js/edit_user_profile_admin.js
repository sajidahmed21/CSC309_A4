$(document).ready(function () {
    // Remove any notification messages after 5 seconds
    var fiveSecondsInMillis = 5000;
    setTimeout(hideNotificationMessage, fiveSecondsInMillis);
    
    // Attach click listener for change name button
    $('#changename_btn').click(changeName);
    
    // Attach click listener for change password button
    $('#changepassword_btn').click(changePassword);
    
    // Attach click listener for delete user button
    $('#deleteuser_btn').click(deleteUser);
    
    // Attach click listeners for all 'remove from course' buttons
    $('.drop_course_btn').click(removeUserFromCourse);
});

var changeName = function () {
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

    var userId = this.value;
    
    $form = $('<form/>', {
        action: '/admin/edit_user/name/' + userId,
        method: 'POST'
    });

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Change Name').appendTo($form);

    $input = $('<input/>', {
        id: 'changeName',
        name: 'newName',
        type: 'text',
        placeholder: 'Preferred Name',
        required: 'required',
        title: 'For sure, you don\'t have an empty name!',
        class: 'standard-green-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        type: 'submit',
        value: 'Edit Now!',
        class: 'btn standard-green-button block_btn'
    });

    $input.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
    
    /* Scroll to top of page */
    $('body').scrollTop(0);
};

/* Removes any notification message displayed on top of the page */
var hideNotificationMessage = function() {
    $message = $('#top-notification-message');
    if ($message !== undefined && $message.length > 0) {
        $message.remove();
    }
    
    $errorMessage = $('#error-message');
    if ($errorMessage !== undefined && $errorMessage.length > 0) {
        $errorMessage.remove();
    }
};


var changePassword = function () {
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

    var userId = this.value;
    
    $form = $('<form/>', {
        action: '/admin/edit_user/change_password/' + userId,
        method: 'POST'
    });

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Change Password').appendTo($form);

    $input = $('<input/>', {
        id: 'new_password_field',
        name: 'newPassword',
        type: 'password',
        placeholder: 'New Password',
        required: 'required',
        pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&\\-])[A-Za-z\\d$@$!%*#?&\\-]{6,20}$',
        title: 'Password must contain at least 1 letter, 1 number, 1 special character, ' +
               ' and must be between 6 and 20 characters long. Special characters include $@!%*#?&-',
        class: 'standard-green-input'
    });

    $input.on('input', hidePasswordMismatchMessage);
    $input.appendTo($form);

    $confirmPasswordInput = $('<input/>', {
        id: 'confirm_new_password_field',
        name: 'newPasswordConfirm',
        type: 'password',
        placeholder: 'Confirm New Password',
        required: 'required',
        class: 'standard-green-input'
    });

    $confirmPasswordInput.on('input', hidePasswordMismatchMessage);
    $confirmPasswordInput.appendTo($form);
    
    /* Password mismatch message */
    $errorMessage = $('<p>', {class: 'password-mismatch-message'});
    $errorMessage.text('Passwords don\'t match');
    $errorMessage.css('display', 'none');
    $errorMessage.appendTo($form);

    $submitButton = $('<input/>', {
        type: 'submit',
        value: 'Edit Now!',
        class: 'btn standard-green-button block_btn'
    });
    
    $submitButton.click(validateChangePasswordInput);
    $submitButton.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
    
    /* Scroll to top of page */
    $('body').scrollTop(0);
};

var deleteUser = function () {
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

    var userId = this.value;
    
    $form = $('<form/>', {
        action: '/admin/delete_user/' + userId,
        method: 'POST'
    });

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Delete Account').appendTo($form);

    $paragraph = $('<p/>', {
        class: 'standard-body'
    });

    $paragraph.text('Are you sure you want to delete this account?');

    $paragraph.appendTo($form);

    $submitButton = $('<input/>', {
        type: 'submit',
        value: 'Delete',
        class: 'btn btn-danger standard-red-button block_btn'
    });

    $submitButton.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
    
    /* Scroll to top of page */
    $('body').scrollTop(0);
};

var removeUserFromCourse = function () {
    var $popup = $('#popup');
    $popup.empty();

    $outer = $('<div/>', {
        id: 'unenroll_form'
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

    var userId = $('#deleteuser_btn').val();
    var courseId = this.value;
    
    $form = $('<form/>', {
        action: '/admin/remove_user_from_course/' + userId,
        method: 'POST'
    });
    
    // Pass in the course id along with POST request.
    $courseId = $('<input/>', {
        type: 'hidden',
        name: 'courseId',
        value: courseId
    });
    
    $courseId.appendTo($form);

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Unenroll').appendTo($form);

    $input = $('<p/>', {
        class: 'standard-body'
    });
    $input.text('Remove user from this course?');

    $input.appendTo($form);

    $removeButton = $('<input/>', {
        type: 'submit',
        value: 'Remove',
        class: 'btn btn-danger standard-red-button block_btn'
    });

    $removeButton.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};

/* Checks if the the new password and its confirmation match or not.
 * Other validations are handled by thr browser.
*/
var validateChangePasswordInput = function() {
    $newPasswordField = $('#new_password_field');
    $confirmPasswordField = $('#confirm_new_password_field');
    
    var fieldsEmpty = false;

    if ($newPasswordField.val().length === 0) {
        fieldsEmpty = true;
    }
    
    else if ($confirmPasswordField.val().length === 0) {
        fieldsEmpty = true;
    }
    
    // Let the browser handle empty fields
    if (fieldsEmpty) {
        return true;
    }
    
    // Check if passwords match
    if ($newPasswordField.val() !== $confirmPasswordField.val()) {
        
        // Show password mismatch messsage
        $errorMessage = $('p.password-mismatch-message');
        $errorMessage.css('display', 'block');
        return false;
    }
    /* The other fields are validated by the browser based on the
     * `pattern` / `required` attributes
     */
    return true;
};

var hidePasswordMismatchMessage = function () {
    $errorMessage = $('p.password-mismatch-message');
    $errorMessage.css('display', 'none');
};

/* Removes any popup from the UI */
var hidePopup = function () {
    var $popup = $('#popup');
    $popup.empty();
    var $unenroll_form = $('#unenroll_form');
    $unenroll_form.css('display', 'none');
};