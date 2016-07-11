$( document ).ready(function() {
    initialize();
    $('#signup_btn').click(function(){
        signupPage();
    });
    $('#userlogin_btn').click(function(){
        loginPage();
    });
});

var loginPage = function(){
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
    $title.text('Login').appendTo($form);
    
    $input = $('<input/>',{
        name : 'userName',
        type : 'text',
        placeholder : 'Username',
        required : 'required',
        class : 'beautiful_red_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        name : 'userPassword',
        type : 'password',
        placeholder : 'Password',
        required : 'required',
        class : 'beautiful_red_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        type : 'submit',
        value : 'Login',
        class : 'btn btn-primary beautiful_red_btn block_btn'
    });
    
    $input.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
}

var signupPage = function(){
   var $popup = $('#popup');
    $popup.empty();
    
    $outer = $('<div/>', {
       id:  'signup_form'
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
    $title.text('Sign Up').appendTo($form);
    
    $input = $('<input/>',{
        name : 'userName',
        type : 'text',
        placeholder : 'Username',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        name : 'userPassword',
        type : 'password',
        placeholder : 'Password',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        name : 'userPasswordConfirm',
        type : 'password',
        placeholder : 'Password Comfirmation',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        name : 'userEmail',
        type : 'email',
        placeholder : 'Email',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        type : 'submit',
        value : 'Join Now!',
        class : 'btn btn-primary beautiful_btn block_btn'
    });
    
    $input.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
};


var initialize = function(){
    hidePopup();
};
var hidePopup = function(){
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