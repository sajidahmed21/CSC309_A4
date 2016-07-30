$(document).ready(function () {
    $('#logout-anchor').click(function () {
        logout();
    });
});

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
        error: function (errMsg) {
            console.log(errMsg);
            hidePopup();
            window.location.href = "/";
        }
    });
};