<<<<<<< HEAD
$(document).ready(function(){
          $("#not-pop-up").hide();
         $(document).on('click',  '#enroll',  function()  {
            //alert("enroll clicked");
            // click button, send ajax, if it returns good, then send a pop saying, enrolled, otherwise, 
            //could not enroll, change button to unenroll. 


        var url = window.location.pathname;
        var class_id = url.slice(url.lastIndexOf('/') + 1);
        // we need to send server review, rating, user_id, class_id
        var data = {
            class_id: class_id
        };
        $.ajax({
            url: '/course/enroll',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                //On ajax success do this
               $("#not-pop-up").children().replaceWith("<h2 class=standard-font style=\"text-align: center;\">You've been enrolled!</h2>");
                $("#not-pop-up").css("background-color", "#1abc9c");
                $("#not-pop-up").show(); // have a pop up here that disappears letting the user know they've enrolled
                setTimeout(function(){ $("#not-pop-up").fadeOut('slow'); }, 1000);
                
                $("#enroll").replaceWith("<button id=\"unenroll\" class=\"unenroll-btn\">Un-Enroll </button>"); 
              },
           error: function(jqxhr, status) {
              //On error do this
             alert("Couldn't enroll at this time");

            }
        });

        return;
    });

    $(document).on('click', '#unenroll', function () {
        // click button, send ajax, if it returns good, then send a pop saying, enrolled, otherwise, 
        //could not enroll, change button to unenroll.  
        var url = window.location.pathname;
        var class_id = url.slice(url.lastIndexOf('/') + 1);
        // we need to send server review, rating, user_id, class_id
        var data = {
            class_id: class_id
        };
        $.ajax({
            url: '/course/unenroll',
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                //On ajax success do this
                 $("#not-pop-up").children().replaceWith("<h2 class=standard-font style=\"text-align: center;\">You've been un-enrolled!</h2>");
                $("#not-pop-up").css("background-color", "#ff5a5f"); // make red
                $("#not-pop-up").show(); // have a pop up here that disappears letting the user know they've enrolled
                setTimeout(function(){ $("#not-pop-up").fadeOut('slow'); }, 1000); // have a pop up here that disappears letting the user know they've enrolled
                 $("#unenroll").replaceWith("<button id=\"enroll\" class=\"enroll-btn\">Enroll </button>"); 
              },
           error: function(jqxhr, status) {
              //On error do this
             alert("Couldn't un-enroll at this time");

            }
        });

        return;
    });
});