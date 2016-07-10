$( document ).ready(function() {
    initialize();
    $('#signup_btn').click(function(){
        var $signup_form = $('#signup_form');
        $signup_form.css('display', 'block');
    });
    $('#userlogin_btn').click(function(){
        var $signup_form = $('#userlogin_form');
        $signup_form.css('display', 'block');
    });
    $('#adminlogin_btn').click(function(){
        var $signup_form = $('#adminlogin_form');
        $signup_form.css('display', 'block');
    });
    $('.cancel_icon').click(function(){
        hidePopup();
    });
});

var initialize = function(){
    hidePopup();
}
var hidePopup = function(){
    var $signup_form = $('#signup_form');
    var $userlogin_form = $('#userlogin_form');
    var $adminlogin_form = $('#adminlogin_form');
    $signup_form.css('display', 'none');
    $userlogin_form.css('display', 'none');
    $adminlogin_form.css('display', 'none');
}