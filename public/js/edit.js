$(document).ready(function() {
        var origCourseDesc =  $("#course-desc").find("p").html();
        var origCourseReqs = $("#requirements").find("p").html();
        function create_save_btn(){
              return $("<button class=\"edit-btn standard-blue-button\" style=\"background-color: green\"> Save </button>");
        }
        function create_edit_btn() {
            return $("<button type=\"button\" class=\"edit-btn standard-green-button \">Edit</button>");
        }               
        $(document).on('click',  '#edit-course-desc',  function()  {
                       var btn = create_save_btn().attr('id', "save-course-desc");
                       $("#edit-course-desc").replaceWith(btn);
                       var content = $("#course-desc").find("p");
                       content.replaceWith("<textarea maxlength = \"1000\" rows = \"8\" id=\"input-coursedesc\" class=\"edit-input form-control standard-font\">" + content.html().trim() + "</textarea>");
        });
                  $(document).on('click',  '#save-course-desc',  function()  {
                                 var input = $("#input-coursedesc").val();
                                 if (!input) {
                                  alert("Enter a description for your course");
                                  return;
                                 } 
                                 var url = window.location.pathname;
                                 var class_id = url.slice(url.lastIndexOf('/')+1);
                                  var data = {coursedesc: input, class_id: class_id};
                                  $.ajax({
                                      url: '/editcoursedesc',
                                      type: 'POST',
                                      contentType:'application/json',
                                      data: JSON.stringify(data),
                                      dataType:'json',
                                    success: function(data){
                                      //On ajax success do this
                                
                                       alert("Edited successfully");
                                       $("#input-coursedesc").replaceWith("<p class=standard-font>" + input + "</p>");
                                         var btn = create_edit_btn().attr('id', "edit-course-desc");
                                        $("#save-course-desc").replaceWith(btn);
                                    },
                                     error: function(jqxhr, status) {
                                    //On error do this
                                        console.log('Error: ' + status);
                                      alert("Couldn't edit at this time");
                                      $("#input-coursedesc").replaceWith("<p class=standard-font>" + origCourseDesc+ "</p>");
                                      var btn = create_edit_btn().attr('id', "edit-course-desc");
                                      $("#save-course-desc").replaceWith(btn);
                                    }
                                  }); 
                  });
                  $(document).on('click',  '#edit-requirements',  function()  {
                                 var btn = create_save_btn().attr('id', "save-requirements");
                                 $("#edit-requirements").replaceWith(btn);
                                 var content = $("#requirements").find("p");
                                 
                                 content.replaceWith("<textarea maxlength = \"1000\" rows = \"8\" id=\"input-requirements\" class=\"edit-input form-control standard-font\">" + content.html().trim() + "</textarea>");
                                 });
                  $(document).on('click',  '#save-requirements',  function()  {
                                 var input = $("#input-requirements").val();
                                 if (!input) {
                                  alert("Enter requirements for your course");
                                  return;
                                 } 
                                 var url = window.location.pathname;
                                 var class_id = url.slice(url.lastIndexOf('/')+1);
                                  var data = {coursereqs: input, class_id: class_id};
                                  $.ajax({
                                      url: '/editcoursereqs',
                                      type: 'POST',
                                      contentType:'application/json',
                                      data: JSON.stringify(data),
                                      dataType:'json',
                                    success: function(data){
                                      //On ajax success do this
                                
                                       alert("Edited successfully");
                                       console.log(input);
                                       $("#input-requirements").replaceWith("<p class=standard-font>" + input + "</p>");
                                         var btn = create_edit_btn().attr('id', "edit-requirements");
                                        $("#save-requirements").replaceWith(btn);
                                    },
                                     error: function(jqxhr, status) {
                                    //On error do this
                                        console.log('Error: ' + status);
                                      alert("Couldn't edit at this time");
                                       $("#input-requirements").replaceWith("<p class=standard-font>" + origCourseReqs+ "</p>");
                                 var btn = create_edit_btn().attr('id', "edit-requirements");
                                 $("#save-requirements").replaceWith(btn);
                                    }
                                  });
                              });                                                               
});