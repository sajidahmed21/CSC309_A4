$( document ).ready(function() {
    initialize();
    $('#reference').click(function(){
        referencePopup();
    });
    $('.cancel_icon').click(function(){
        hidePopup();
    });
});

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

var referencePopup = function(){
    var $popup = $('#popup');
    $popup.empty();
    
    $outer = $('<div/>', {
       id:  'reference_form'
    });
    
    $middle = $('<div/>', {
       class:  'col-md-6'
    });
    
    $container = $('<div/>', {
       class:  'standard-ref-container'
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
    $title.text('References').appendTo($form);
    
    $ul = $('<ul/>');
    
    $ul.css('list-style-type', 'none');
    $ul.css('margin', '0');
    $ul.css('padding', '0');
    $ul.css('text-align', 'center');
    
    $li = $('<li/>',{
        class: 'standard_ref_list'
    });
    
    $li.text('Youtube. (Company). (2005). maxresdefault. [Digital image]. Retrieved from https://i.ytimg.com/vi/MWOdIIGOHGU/maxresdefault.jpg');
            
    $li.appendTo($ul);
    
    $li = $('<li/>', {
        class: 'standard_ref_list'
    });
    
    $li.text('Youtube. (Company). (2005). maxresdefault. [Digital image]. Retrieved from https://i.ytimg.com/vi/LrGPkzy6mFo/maxresdefault.jpg');
            
    $li.appendTo($ul);
    
    $li = $('<li/>',{
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