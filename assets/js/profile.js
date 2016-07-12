$( document ).ready(function() {
    initialize();
    $('.drop_course_btn').click(function(){
        var $unenroll_form = $('#unenroll_form');
        $unenroll_form.css('display', 'block');
    });
    $('.edit_profile_btn').click(function(){
        editPage();
    });
    $('.cancel_icon').click(function(){
        hidePopup();
    });
});

var initialize = function(){
    hidePopup();
}

var hidePopup = function(){
    var $popup = $('#popup');
    $popup.empty();
    var $unenroll_form = $('#unenroll_form');
    $unenroll_form.css('display', 'none');
}

var editPage = function(){
    var $popup = $('#popup');
    $popup.empty();
    
    $outer = $('<div/>', {
       id:  'userlogin_form'
    });
    
    $middle = $('<div/>', {
       class:  'col-md-6'
    });
    
    $container = $('<div/>', {
       class:  'beautiful_container'
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
        class : 'beautiful_title'
    });
    $title.text('Change Password').appendTo($form);
    
    $input = $('<input/>',{
        name : 'userPassword',
        type : 'password',
        placeholder : 'Password',
        required : 'required',
        class : 'beautiful_green_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        name : 'userPasswordConfirm',
        type : 'password',
        placeholder : 'Password Confirm',
        required : 'required',
        class : 'beautiful_green_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        type : 'submit',
        value : 'Edit Now!',
        class : 'btn btn-primary beautiful_green_btn block_btn'
    });
    
    $input.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
}