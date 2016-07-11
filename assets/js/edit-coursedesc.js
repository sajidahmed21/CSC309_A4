$(document).ready(function() {
                  $("#add_cat").click(function() {
                                     var addthis=  $("<div class=form-group><label class=col-md-2 control-label><input class=form-control type=text palceholder=title type=text> </label> <div class=col-md-10> <textarea class=form-control rows=5 placeholder=Enter Description> </textarea></div></div>");
                                      
                                       $("#fields").append(addthis);     
                                     
                                  });
});