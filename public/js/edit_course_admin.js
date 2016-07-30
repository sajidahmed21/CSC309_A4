$(document).ready(function () {

    /* Click listener for delete course button */
    $('#delete_course_button').click(showDeleteWarning);

    /* Click listener for delete review button */
    $('.delete_review_button').click(deleteReview);

});

function showDeleteWarning() {

    /* Remove any existing popups */
    hideDeleteCoursePopup();

    var $popup = $('<article/>', {
        id: 'popup'
    });

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

    $cancelicon.click(hideDeleteCoursePopup);
    $cancelwrapper.append($cancelicon);

    $container.append($cancelwrapper);

    var url = window.location.pathname;
    var courseId = url.slice(url.lastIndexOf('/') + 1);

    $form = $('<form/>', {
        id: 'create_user_form',
        action: '/admin/delete_course/' + courseId,
        method: 'POST'
    });

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Are you sure you want to delete this course?').appendTo($form);

    $submitButton = $('<input/>', {
        type: 'submit',
        value: 'Delete',
        class: 'standard-red-button block_btn btn-danger'
    });

    $submitButton.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);

    $body = $('body');

    $body.append($popup);

    /* Scroll to top of page */
    $body.scrollTop(0);
}

function hideDeleteCoursePopup() {
    $('#popup').remove();
}


/* Click listener function for delete review buttons */
function deleteReview() {
    var url = window.location.pathname;
    var courseId = url.slice(url.lastIndexOf('/') + 1);
    var userId = this.value;

    var requestBody = {
        courseId: courseId,
        userId: userId
    };

    $.ajax({
        type: "POST",
        url: "/admin/delete_review",
        data: JSON.stringify(requestBody),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.status == 'Success') {
                location.reload(true);
            }
        },
        failure: function () {
            hidePopup();
            alert('Oops! Something went wrong. Please try later.');
        },
        error: function () {
            hidePopup();
            alert('Oops! Something went wrong. Please try later.');
        }
    });
}