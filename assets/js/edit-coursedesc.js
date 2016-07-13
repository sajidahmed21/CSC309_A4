// TODO: Refactor and rename

$(document).ready(function() {
                  function create_save_btn(){
                  return $("<button type=button class=\"btn btn-primary save-button\" style=\"background-color: green\"> Save </button>");
                  }
                  function create_edit_btn() {
                  return $("<button type=\"button\" class=\"btn btn-primary standard-blue-button edit-btn\">Edit</button>");
                  }
                  // for edit-coursedesc not edit-coursedesc2
    $("#add_cat").click(function() {
        if ($("#fields").children().length < 10) {
            var addthis=  $("<div class=form-group><label class=col-md-2 control-label><input class=form-control type=text palceholder=title type=text> </label> <div class=col-md-10> <textarea class=form-control rows=5 placeholder=Enter Description> </textarea></div></div>");
            $("#fields").append(addthis);
        }
    });
    
                  
                  // edit button is clicked
                  
                  // check what the id is
                  //replace
                  // do stuff based on id font style etc
        // when edit for title is clicked
    
                             $(document).on('click',  '#edit-title',  function()  {
                             // add save button now
                             $("#edit-title").replaceWith("<button type=button id=save-title class=\"btn btn-primary save-button\" style=\"background-color: green\"> Save </button>");
                             // turn title container into textarea
                             console.log($("#save-title").html());
                             console.log($(".course-title").html());
                               console.log($(".course-title").width());
                             $(".course-title").replaceWith("<input id=\"input-title\" class=\"form-control standard-font course-title\" type=text maxlength=15 style=\"width:" +  $(".course-title").width() + "px; height:" +  $(".course-title").height() +"px; text-align: left;\" value=\"" + $(".course-title").html().trim() + "\">");
                             });
                  
                  $(document).on('click',  '#save-title',  function()  {
                                 var input = $("#input-title").val();
                                 console.log(input);
                                 $("#input-title").replaceWith("<h1 id=course-title class=\"standard-font course-title\">" +
                                                               input
                                                               +
                                                               "</h1>");
                                 var btn = create_edit_btn().attr('id', "edit-title");
                                 $("#save-title").replaceWith(btn);
                                 });
                  
                  $(document).on('click',  '#edit-course-desc',  function()  {
                                 var btn = create_save_btn().attr('id', "save-course-desc");
                                 $("#edit-course-desc").replaceWith(btn);
                                
                                 
                 // var h1 = $("#course-desc").find("h1");
                                 var content = $("#course-desc").find("div");
                  //h1.replaceWith("<input id=\"input-coursedesc-h1\" class=\"form-control standard-font \" type=text maxlength=20 value=\"" + $h1.html().trim() + "\">");
                                 content.replaceWith("<textarea id=\"input-coursedesc\" style=\"height: 400px; \" class=\"form-control standard-font\">" + content.html().trim() + "</textarea>");
                                 });
                  
                  $(document).on('click',  '#save-course-desc',  function()  {
                                 var input = $("#input-coursedesc").val();
                                 $("#input-coursedesc").replaceWith("<div class=standard-font>" + input + "</div>");
                                 var btn = create_edit_btn().attr('id', "edit-course-desc");
                                 $("#save-course-desc").replaceWith(btn);
                                 
                                 
                                 });
                  
                  $(document).on('click',  '#edit-requirements',  function()  {
                                 var btn = create_save_btn().attr('id', "save-requirements");
                                 $("#edit-requirements").replaceWith(btn);
                                 
                                 
                                 // var h1 = $("#course-desc").find("h1");
                                 var content = $("#requirements").find("div");
                                 //h1.replaceWith("<input id=\"input-coursedesc-h1\" class=\"form-control standard-font \" type=text maxlength=20 value=\"" + $h1.html().trim() + "\">");
                                 content.replaceWith("<textarea id=\"input-requirements\" style=\"height: 400px; \" class=\"form-control standard-font\">" + content.html().trim() + "</textarea>");
                                 });
                  
                  $(document).on('click',  '#save-requirements',  function()  {
                                 var input = $("#input-requirements").val();
                                 $("#input-requirements").replaceWith("<div class=standard-font>" + input + "</div>");
                                 var btn = create_edit_btn().attr('id', "edit-requirements");
                                 $("#save-requirements").replaceWith(btn);
                                 
                                 
                                 });
                  
                  
});