function search() {
    var searchText = $('input#search').val();
    
    // if the text didn't change, don't do anything
    if (searchText === window.lastSearchText) {
        return;
    }
    
    console.log('search triggered for: [' + searchText + ']');
    
    // otherwise, set the last search and and update as needed
    window.lastSearchText = searchText;
    if (searchText === '') {
        $('main').addClass('no-search');
    }
    else {
        // run the search
        $('main').removeClass('no-search');
    }
}


window.onload = function() {
    $('input#search').on('change keyup paste mouseup', search);
    
    window.lastSearchText = '';
    
    // run search on load in case there was an automatically filled value
    search();
};

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
    var $popup = $('#popup');
    $popup.empty();
    var $unenroll_form = $('#unenroll_form');
    $unenroll_form.css('display', 'none');
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