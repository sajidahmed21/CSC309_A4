$(document).ready(function () {
    // Remove any notification messages after 5 seconds
    var fiveSecondsInMillis = 5000;
    setTimeout(hideNotificationMessage, fiveSecondsInMillis);
    
    // Attach click listener for change name button
    $('#changename_btn').click(changeName);
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

/* Removes any popup from the UI */
var hidePopup = function () {
    var $popup = $('#popup');
    $popup.empty();
    var $unenroll_form = $('#unenroll_form');
    $unenroll_form.css('display', 'none');
};