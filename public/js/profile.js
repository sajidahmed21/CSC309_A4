$(document).ready(function () {
    initialize();
    $('.drop_course_btn').click(function () {
        console.log(this.value);
        dropCourse(this.value);
    });
    $('#changepassword_btn').click(function () {
        changePassword();
    });
    $('#changename_btn').click(function () {
        changeName();
    });
    $('#deleteuser_btn').click(function () {
        deleteUser();
    });
    $('#reference').click(function () {
        referencePopup();
    });
    $('.cancel_icon').click(function () {
        hidePopup();
    });
    $('#logout-anchor').click(function () {
        logout();
    });
    $('#unfollow_btn').click(function () {
        unfollow(this.value);
    });
    $('#follow_btn').click(function () {
        follow(this.value);
    });
});

var unfollow = function (followee_id) {
    var body = {
        "followee": followee_id
    }
    console.log('send');
    $.ajax({
        type: "POST",
        url: "/user/unfollow",
        data: JSON.stringify(body),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            hidePopup();
            console.log(data);
            window.location.href = "/user/profile/" + followee_id;
        },
        error: function (data) {
            hidePopup();
            window.location.href = "/?errorMessage=Your%20session%20has%20expired";
        }
    });
}

var follow = function (followee_id) {
    var body = {
        "followee": followee_id
    }

    $.ajax({
        type: "POST",
        url: "/user/follow",
        data: JSON.stringify(body),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            hidePopup();
            console.log(data);
            window.location.href = "/user/profile/" + followee_id;
        },
        error: function (data) {
            hidePopup();
            window.location.href = "/?errorMessage=Your%20session%20has%20expired";
        }
    });
}

var dropCourse = function (dropCourse_id) {
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

    $form = $('<form/>');

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Unenroll').appendTo($form);

    $input = $('<p/>', {
        class: 'standard-body'
    });
    $input.text('Are you sure you want to unenroll?');

    $input.appendTo($form);

    $input = $('<input/>', {
        type: 'button',
        value: 'Unenroll',
        class: 'btn btn-danger standard-red-button block_btn'
    });

    $input.click(function () {
        var body = {
            "dropCourse_id": dropCourse_id
        }

        $.ajax({
            type: "POST",
            url: "/user/unenrollClasses",
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                hidePopup();
                console.log(data);
                window.location.href = "/user/profile";
            },
            error: function (data) {
                hidePopup();
                window.location.href = "/?errorMessage=Your%20session%20has%20expired";
            }
        });
    });

    $input.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};

var logout = function () {
    $.ajax({
        type: "POST",
        url: "/user/logout",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            hidePopup();
            console.log(data);
            window.location.href = "/";
        },
        error: function (data) {
            hidePopup();
            window.location.href = "/?errorMessage=Your%20session%20has%20expired";
        }
    });
};

var initialize = function () {
    hidePopup();
};

var hidePopup = function () {
    var $popup = $('#popup');
    $popup.empty();
    var $unenroll_form = $('#unenroll_form');
    $unenroll_form.css('display', 'none');
};

var referencePopup = function () {
    var $popup = $('#popup');
    $popup.empty();

    $outer = $('<div/>', {
        id: 'reference_form'
    });

    $middle = $('<div/>', {
        class: 'col-md-6'
    });

    $container = $('<div/>', {
        class: 'standard-ref-container'
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

    $form = $('<form/>');

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('References').appendTo($form);

    $ul = $('<ul/>');

    $ul.css('list-style-type', 'none');
    $ul.css('margin', '0');
    $ul.css('padding', '0');
    $ul.css('text-align', 'center');

    $li = $('<li/>', {
        class: 'standard_ref_list'
    });

    $li.text('Youtube. (Company). (2005). maxresdefault. [Digital image]. Retrieved from https://i.ytimg.com/vi/MWOdIIGOHGU/maxresdefault.jpg');

    $li.appendTo($ul);

    $li = $('<li/>', {
        class: 'standard_ref_list'
    });

    $li.text('Youtube. (Company). (2005). maxresdefault. [Digital image]. Retrieved from https://i.ytimg.com/vi/LrGPkzy6mFo/maxresdefault.jpg');

    $li.appendTo($ul);

    $li = $('<li/>', {
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

    $form = $('<form/>');

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Delete Account').appendTo($form);

    $paraharph = $('<p/>', {
        class: 'standard-body'
    });

    $paraharph.text('Are you sure to delete this account?');

    $paraharph.appendTo($form);

    $input = $('<input/>', {
        type: 'button',
        value: 'Delete',
        class: 'btn btn-danger standard-red-button block_btn'
    });

    $input.click(function () {
        var body = {};

        $.ajax({
            type: "POST",
            url: "/user/deleteuser",
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                hidePopup();
                console.log(data);
                window.location.href = "/";
            },
            error: function (data) {
                hidePopup();
                window.location.href = "/?errorMessage=Your%20session%20has%20expired";
            }
        });
    });

    $input.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
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

    $form = $('<form/>');

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Change Password').appendTo($form);

    $input = $('<input/>', {
        id: 'userPassword',
        name: 'userPassword',
        type: 'password',
        placeholder: 'Password',
        required: 'required',
        class: 'standard-green-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'userPasswordConfirm',
        name: 'userPasswordConfirm',
        type: 'password',
        placeholder: 'Password Confirm',
        required: 'required',
        class: 'standard-green-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        type: 'submit',
        value: 'Edit Now!',
        class: 'btn standard-green-button block_btn'
    });

//    $input.click(function () {
//        if ($('#userPassword').val() != $('#userPasswordConfirm').val()) {
//            $popup.empty();
//            $('#error-message').empty();
//            $('#error-message').css('display', 'block');
//            $('#error-message').text('Your password do not match');
//        } else if ($('#userPassword').val().length < 8) {
//            $popup.empty();
//            $('#error-message').empty();
//
//            $('#error-message').css('display', 'block');
//            $('#error-message').text('Your password must be at least length of 8!');
//        } else {
//            var body = {
//                "changePassword": $('#userPassword').val()
//            }
//
//            $.ajax({
//                type: "POST",
//                url: "/user/changepassword",
//                data: JSON.stringify(body),
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                success: function (data) {
//                    hidePopup();
//                    console.log(data);
//                    window.location.href = "/user/profile";
//                },
//                error: function (data) {
//                    hidePopup();
//                    window.location.href = "/?errorMessage=Your%20session%20has%20expired";
//                }
//            });
//        }
//    });

    $input.appendTo($form);
    $form.submit(function(e){
        e.preventDefault(); 
        if ($('#userPassword').val() != $('#userPasswordConfirm').val()) {
            $popup.empty();
            $('#error-message').empty();
            $('#error-message').css('display', 'block');
            $('#error-message').text('Your password do not match');
        } else if ($('#userPassword').val().length < 8) {
            $popup.empty();
            $('#error-message').empty();

            $('#error-message').css('display', 'block');
            $('#error-message').text('Your password must be at least length of 8!');
        } else {
            var body = {
                "changePassword": $('#userPassword').val()
            }

            $.ajax({
                type: "POST",
                url: "/user/changepassword",
                data: JSON.stringify(body),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    hidePopup();
                    console.log(data);
                    window.location.href = "/user/profile";
                },
                error: function (data) {
                    hidePopup();
                    window.location.href = "/?errorMessage=Your%20session%20has%20expired";
                }
            });
        }
    })
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};

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

    $form = $('<form/>');

    $title = $('<h1/>', {
        class: 'standard-title'
    });
    $title.text('Change Name').appendTo($form);

    $input = $('<input/>', {
        id: 'changeName',
        name: 'changeName',
        type: 'text',
        placeholder: 'Preferred Name',
        required: 'required',
        class: 'standard-green-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        type: 'submit',
        value: 'Edit Now!',
        class: 'btn standard-green-button block_btn'
    });

//    $input.click(function () {
//        if ($('#changeName').val().length < 1) {
//            $popup.empty();
//            $('#error-message').css('display', 'block');
//            $('#error-message').text('Your name cannot be Empty!');
//        } else {
//            var body = {
//                "changeName": $('#changeName').val()
//            }
//
//            $.ajax({
//                type: "POST",
//                url: "/user/changename",
//                data: JSON.stringify(body),
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                success: function (data) {
//                    hidePopup();
//                    console.log(data);
//                    window.location.href = "/user/profile";
//                },
//                error: function (data) {
//                    var errormsg = {
//                        errorMessage: "Your session has expired"
//                    }
//                    console.log('ERRORFAIL');
//                    window.location.href = "/?errorMessage=Your%20session%20has%20expired";
//                }
//            });
//        }
//    });

    $input.appendTo($form);
    
    $form.submit(function(e){
        e.preventDefault();
        if ($('#changeName').val().length < 1) {
            $popup.empty();
            $('#error-message').css('display', 'block');
            $('#error-message').text('Your name cannot be Empty!');
        } else {
            var body = {
                "changeName": $('#changeName').val()
            }

            $.ajax({
                type: "POST",
                url: "/user/changename",
                data: JSON.stringify(body),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    hidePopup();
                    console.log(data);
                    window.location.href = "/user/profile";
                },
                error: function (data) {
                    var errormsg = {
                        errorMessage: "Your session has expired"
                    }
                    console.log('ERRORFAIL');
                    window.location.href = "/?errorMessage=Your%20session%20has%20expired";
                }
            });
        }
    })

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};