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
        id : 'userName',
        name : 'userName',
        type : 'text',
        placeholder : 'Username',
        required : 'required',
        class : 'beautiful_red_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id: 'userPassword',
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
        class : 'btn btn-primary beautiful_red_btn block_btn',
        onclick: "JavaScript:return true;"
    });
    
    $input.click(function(){
        if(document.getElementById('userName').value.length >=1 && document.getElementById('userPassword').value.length >=1)
        {
            hidePopup();
            window.location = "./profile.html";
        }
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        type : 'button',
        value : 'Facebook Login',
        class : 'btn btn-primary beautiful_red_btn block_btn'
    });
    
    $input.css('margin-top','10px');
    
    $input.click(function(){
        hidePopup();
        window.location = "./profile.html";
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
        id : 'userName',
        name : 'userName',
        type : 'text',
        placeholder : 'Username',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'userPassword',
        name : 'userPassword',
        type : 'password',
        placeholder : 'Password',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'userPasswordConfirm',
        name : 'userPasswordConfirm',
        type : 'password',
        placeholder : 'Password Comfirmation',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'userEmail',
        name : 'userEmail',
        type : 'email',
        placeholder : 'Email',
        required : 'required',
        class : 'beautiful_input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        type : 'button',
        value : 'Join Now!',
        class : 'btn btn-primary beautiful_btn block_btn',
        onclick: "JavaScript: return true;"
    });
    
    $input.click(function(){
        
        if(document.getElementById('userName').value.length >=1 && document.getElementById('userPassword').value.length >=1 && document.getElementById('userPasswordConfirm').value.length == document.getElementById('userPassword').value.length && document.getElementById('userEmail').value.length >=1)
        {
            console.log('here');
            hidePopup();
            window.location = "./profile.html";
        }
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        type : 'button',
        value : 'Facebook Sign Up',
        class : 'btn btn-primary beautiful_btn block_btn'
    });
    
    $input.css('margin-top','10px');
    
    $input.click(function(){
        hidePopup();
        window.location = "./profile.html";
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