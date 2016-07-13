$( document ).ready(function() {
    initialize();
    $('.drop_course_btn').click(function(){
        var $unenroll_form = $('#unenroll_form');
        $unenroll_form.css('display', 'block');
    });
    $('#changepassword_btn').click(function(){
        changePassword();
    });
    $('#deleteuser_btn').click(function(){
        deleteUser();
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

var deleteUser = function(){
    var $popup = $('#popup');
    $popup.empty();
    
    $outer = $('<div/>', {
       id:  'userlogin_form'
    });
    
    $middle = $('<div/>', {
       class:  'col-md-6'
    });
    
    $container = $('<div/>', {
       class:  'standard-container'
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
    $title.text('Delete Account').appendTo($form);
    
    $paraharph = $('<p/>',{
        class : 'standard-body'
    });
    
    $paraharph.text('Are you sure to delete this account?');
    
    $paraharph.appendTo($form);
    
    $input = $('<input/>',{
        type : 'submit',
        value : 'Edit Now!',
        class : 'btn btn-danger standard-red-button block_btn'
    });
    
    $input.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
}

var changePassword = function(){
    var $popup = $('#popup');
    $popup.empty();
    
    $outer = $('<div/>', {
       id:  'userlogin_form'
    });
    
    $middle = $('<div/>', {
       class:  'col-md-6'
    });
    
    $container = $('<div/>', {
       class:  'standard-container'
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
    $title.text('Change Password').appendTo($form);
    
    $input = $('<input/>',{
        name : 'userPassword',
        type : 'password',
        placeholder : 'Password',
        required : 'required',
        class : 'standard-green-input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        name : 'userPasswordConfirm',
        type : 'password',
        placeholder : 'Password Confirm',
        required : 'required',
        class : 'standard-green-input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        type : 'submit',
        value : 'Edit Now!',
        class : 'btn standard-green-button block_btn'
    });
    
    $input.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
}