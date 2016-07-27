$(document).ready(function(){

         $(document).on('click',  '#enroll',  function()  {
            //alert("enroll clicked");
            // click button, send ajax, if it returns good, then send a pop saying, enrolled, otherwise, 
            //could not enroll, change button to unenroll. 

           
           var url = window.location.pathname;
           var class_id = url.slice(url.lastIndexOf('/')+1);
           // we need to send server review, rating, user_id, class_id
           var data = {class_id: class_id};
            $.ajax({
                url: '/course/enroll',
                type: 'POST',
                contentType:'application/json',
                data: JSON.stringify(data),
                dataType:'json',
             success: function(data){
                //On ajax success do this
                alert("You were successfully enrolled"); // have a pop up here that disappears letting the user know they've enrolled
                $("#enroll").replaceWith("<button id=\"unenroll\" class=\"unenroll-btn\">Un-Enroll </button>"); 
              },
           error: function(jqxhr, status) {
              //On error do this
             alert("Couldn't enroll at this time");
            }
         }); 
            
            return;
        });
        
         $(document).on('click',  '#unenroll',  function()  {
            // click button, send ajax, if it returns good, then send a pop saying, enrolled, otherwise, 
            //could not enroll, change button to unenroll.  
           var url = window.location.pathname;
           var class_id = url.slice(url.lastIndexOf('/')+1);
           // we need to send server review, rating, user_id, class_id
           var data = {class_id: class_id};
            $.ajax({
                url: '/course/unenroll',
                type: 'DELETE',
                contentType:'application/json',
                data: JSON.stringify(data),
                dataType:'json',
             success: function(data){
                //On ajax success do this
                alert("You were successfully enrolled"); // have a pop up here that disappears letting the user know they've enrolled
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