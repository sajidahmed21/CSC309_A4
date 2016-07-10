$( document ).ready(function() {
    initialize();
    $('.drop_course_btn').click(function(){
        var $unenroll_form = $('#unenroll_form');
        $unenroll_form.css('display', 'block');
    });
    $('.cancel_icon').click(function(){
        hidePopup();
    });
});

var initialize = function(){
    hidePopup();
}
var hidePopup = function(){
    var $unenroll_form = $('#unenroll_form');
    $unenroll_form.css('display', 'none');
}