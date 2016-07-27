$(document).ready(function(){
    var rating;
        function changeColor(number, color) {
                for (i = 1; i < number + 1; i++) {
                        $("#star"+i).css("color", color);
                }
        }

    $("#star1").hover(function(){
            changeColor(1, "pink");
        }, function(){
            changeColor(1, "grey");  
    });

    $("#star2").hover(function(){
            changeColor(2, "pink");
        }, function(){
            changeColor(2, "grey");   
    });

    $("#star3").hover(function(){
            changeColor(3, "pink");
        }, function(){
            changeColor(3, "grey");   
    });
    $("#star4").hover(function(){
            changeColor(4, "pink");
        }, function(){
            changeColor(4, "grey");    
    });
    $("#star5").hover(function(){
            changeColor(5, "pink");
        }, function(){
            changeColor(5, "grey");   
    });
    $("#star1").click(function(){
        removeHover(1);
        changeColor(5, "grey");
        changeColor(1, "pink");
    });
    $("#star2").click(function(){
        removeHover(2);
        changeColor(5, "grey");
        changeColor(2, "pink");
    });
    $("#star3").click(function(){
        removeHover(3);
        changeColor(5, "grey");
        changeColor(3, "pink");
    });
    $("#star4").click(function(){
        removeHover(4);
        changeColor(5, "grey");
        changeColor(4, "pink");
    });
    $("#star5").click(function(){
        removeHover(5);
        changeColor(5, "grey");
        changeColor(5, "pink");
    });
function removeHover(number) {
    for(i=1; i < 6; i++) {
        $("#star"+i).unbind('mouseenter mouseleave');
       
    }
    $("#rating").html("Rated "+number+"/5");
    rating = number;
}

        $("#reviewsubmit").click(function() {
            console.log(rating);
             if (!rating) { // user didn't rate
                alert("Enter A Rating!");
                return;
            }

            // disable comment section
            // we assume the review comment section is available only to users who can review, so no need to check that
            // send JSON data to server, server checks data, adds it to database, and responds with success, 
            // and a message is delivered to the user: Thanks, review posted !
            $("#reviewinput").attr("disabled", true); // disable review section 
             for(i=1; i < 6; i++) { // disable ratings
                $("#star"+i).unbind();
              }
           var review = $('textarea#reviewinput').val();
           if (!review) {
            alert("Enter a Review ! ");
            return;
           }
           var url = window.location.pathname;
           var class_id = url.slice(url.lastIndexOf('/')+1);
           // we need to send server review, rating, user_id, class_id
           var data = {review: review, rating: rating, class_id: class_id};
            $.ajax({
                url: '/submitreview',
                type: 'POST',
                contentType:'application/json',
                data: JSON.stringify(data),
                dataType:'json',
             success: function(data){
                //On ajax success do this
                $("#message").css("color", "green");
                $("#message").html("Your review has been posted");
              },
           error: function(jqxhr, status) {
              //On error do this
              console.log('Error: ' + status);
              $("#message").css("color", "red");
              $("#message").html("Your review could not be posted at this time");
            }
         }); 
        });
});