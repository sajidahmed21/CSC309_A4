$(document).ready(function () {
    //initialize();
    $('#signup_btn').click(function () {
        signupPage();
    });
    $('#userlogin_btn').click(function () {
        loginPage();
    });
    $('#reference').click(function () {
        referencePopup();
    });
});

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

var loginPage = function () {
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
        class: 'standard-red-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'signinPassword',
        name: 'signinPassword',
        type: 'password',
        placeholder: 'Password',
        required: 'required',
        class: 'standard-red-input'
    });

    $input.appendTo($form);

    $input = $('<button/>', {
        type: 'submit',
        text: 'Login',
        class: 'btn btn-danger standard-red-button block_btn',
    });
    
//    $input.click(function () {
//        var body = {
//            "signinUsername": $('#userName').val(),
//            "signinPassword": $('#userPassword').val(),
//        }
//
//        $.ajax({
//            type: "POST",
//            url: "/user/signin",
//            data: JSON.stringify(body),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (data) {
//                hidePopup();
//                console.log(data);
//                window.location.href = "/user/profile";
//            },
//            error: function (data) {
//                hidePopup();
//                $("body").html(data.responseText);
//            }
//        });
//    });

    $input.appendTo($form);
    
    $input = $('<input/>', {
        type: 'button',
        value: 'Facebook Login',
        class: 'btn btn-danger standard-red-button block_btn'
    });

    $input.css('margin-top', '10px');

    $input.click(function () {
        hidePopup();
        window.location = "./profile";
    });

    $input.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};

var signupPage = function () {
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
        class: 'standard-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'signupPassword',
        name: 'signupPassword',
        type: 'password',
        placeholder: 'Password',
        required: 'required',
        class: 'standard-input'
    });

    $input.appendTo($form);

    $input = $('<input/>', {
        id: 'userPasswordConfirm',
        name: 'userPasswordConfirm',
        type: 'password',
        placeholder: 'Password Comfirmation',
        required: 'required',
        class: 'standard-input'
    });

    $input.appendTo($form);

    /*$input = $('<input/>', {
        id: 'userEmail',
        name: 'userEmail',
        type: 'email',
        placeholder: 'Email',
        required: 'required',
        class: 'standard-input'
    });

    $input.appendTo($form);*/
    
    $input = $('<button/>', {
        type: 'submit',
        text: 'Join Now!',
        class: 'standard-blue-button block_btn',
    });

    $input.appendTo($form);

//    $input.click(function () {
//        console.log($('#name').val());
//        console.log($('#userPassword').val());
//        var body = {
//            "signupName": $('#name').val(),
//            "signupUsername": $('#userName').val(),
//            "signupPassword": $('#userPassword').val(),
//            "userPasswordConfirm": $('#userPasswordConfirm').val(),
//            "signupProfilePicture": "sfkjsdn"
//        }
//
//        $.ajax({
//            type: "POST",
//            url: "/user/signup",
//            data: JSON.stringify(body),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (data) {
//                hidePopup();
//                console.log(data);
//                window.location.href = "/user/profile";
//            },
//            error: function (data) {
//                hidePopup();
//                $("body").html(data.responseText);
//            }
//        });
//    });

    $input = $('<input/>', {
        type: 'button',
        value: 'Facebook Sign Up',
        'class': 'standard-blue-button block_btn'
    });

    $input.css('margin-top', '10px');

    $input.click(function () {
        hidePopup();
        window.location = "./profile.html";
    });

    $input.appendTo($form);

    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};


//var initialize = function(){
//    hidePopup();
//};
var hidePopup = function () {
    console.log("hide");
    var $popup = $('#popup');
    $popup.empty();

    var $signup_form = $('#signup_form');
    var $userlogin_form = $('#userlogin_form');
    var $adminlogin_form = $('#adminlogin_form');
    $signup_form.css('display', 'none');
    $userlogin_form.css('display', 'none');
    $adminlogin_form.css('display', 'none');
};