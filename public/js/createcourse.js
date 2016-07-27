//clientside validation

 function updateImg(event) {
            var output = document.getElementById('banner_img');
            output.src = URL.createObjectURL(event.target.files[0]);
    }
    function validateForm() {
        var courseTitle = document.forms["course-form"]["courseTitle"].value;
        var courseDesc = document.forms["course-form"]["courseDesc"].value;
        var courseReqs = document.forms["course-form"]["courseReqs"].value;
        var courseBanner = document.forms["course-form"]["courseBanner"].value;
        // file input validation, file size, file dimensions, file type (must be image) etc
        reset();
        var num_errors = 0;
        var pattern = /\w*(asdf)+\w*/i;
        var pat2 = /[a-z0-9]{5,}/i;
        if (pattern.test(courseTitle)) {
            num_errors++;
            $("#div-title").append("<span id=\"helpBlock1\" class=\"help-block\">Please enter a valid course title.</span>");
            $("#form-title").addClass("has-error");
        } 
        else if (!pat2.test(courseTitle)) {
            num_errors++;
            $("#div-title").append("<span id=\"helpBlock1\" class=\"help-block\">No special characters, must be a minumum of 5 characters.</span>");
            $("#form-title").addClass("has-error");
        } else {    
        $("#form-title").addClass("has-success");
        }
        if (courseDesc.length < 50) {
            num_errors++;
            $("#div-desc").append("<span id=\"helpBlock2\" class=\"help-block\">Description is too short.</span>");
            $("#form-desc").addClass("has-error");
        } else {
            $("#form-desc").addClass("has-success");
        }
        if (courseReqs.length < 50) {
            num_errors++;
            $("#div-req").append("<span id=\"helpBlock3\" class=\"help-block\">Requirements is too short.</span>");
            $("#form-req").addClass("has-error");
        } else {
            $("#form-req").addClass("has-success");
        }
        var pattern = /(\.gif$|\.jpg$|\.png$)/i;
        if (!pattern.test(courseBanner) && courseBanner != "") {
            num_errors++;
            $("#div-banner").append("<span id=\"helpBlock4\" class=\"help-block\">Please upload an image file</span>");
            $("#form-banner").addClass("has-error");
        }
        else {
             $("#form-banner").addClass("has-success");
        }
        return num_errors == 0;
    }
    function reset() {
        $(".help-block").remove();
        $("#form-title").removeClass("has-success has-error");
        $("#form-req").removeClass("has-success has-error");
        $("#form-desc").removeClass("has-success has-error");
        $("#form-banner").removeClass("has-success has-error");
    }