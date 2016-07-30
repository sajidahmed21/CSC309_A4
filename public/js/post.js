$(document).ready(function () {
    $("#post-btn").click(function () {
        var post = $('textarea#post-input').val();
        if (!post) {
            $("#post-msg").css("color", "#8B0000");
            $("#post-msg").html("Enter Post");
            return;
        }
        var url = window.location.pathname;
        var class_id = url.slice(url.lastIndexOf('/') + 1);
        // we need to send server review, rating, user_id, class_id
        var data = {
            post: post,
            class_id: class_id
        };
        $.ajax({
            url: '/submitpost',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                //On ajax success do this
                $("#post-msg").css("color", "#2F5E2F");
                $("#post-msg").html("Posted successfully");
            },
            error: function (jqxhr, status) {
                //On error do this
                console.log('Error: ' + status);
                $("#post-msg").css("color", "#8B0000");
                $("#post-msg").html("Couldn't post at this time");
            }
        });
    });
});