$(document).ready(function() {
    
    if ($('#error-message').length > 0) {
        // Show users tab if there are error messages
        showUsersTab(false);
    }
    else {
        refreshAnaltyicsData();
    }
    attachClickListeners();
});

function attachClickListeners() {
    $('#analytics-tab').click(refreshAnaltyicsData);
    $('#users-tab').click(function()  {
        showUsersTab(true);
    });
    $('#class-tab').click(showClassTab);
}

/* Refreshes / retrieves analytics data from the server */
function refreshAnaltyicsData() {
    $.ajax({
        url: '/admin/analytics',
        method: 'GET',
        dataType: 'json'
    }).fail(function(jqXHR, status) {
        console.log('Analytics request failed: ' + status);
        // Show error message to user if there is an error
        alert('Network Error: Could not refresh Analytics data');
        
    }).done(showAnalyticsTab);
}

/* Show the analytics tab */
function showAnalyticsTab(data) {
    if (data === undefined) {
        alert('Error: Could not retrieve data');
        return;
    }
    
    selectTab('#analytics-tab', true);
    
    $mainContent = $('#main-content').empty();
    
    $analyticsTab = $('<section/>', {id: 'analytics-section'});
    
    // Section containing analytics data of users
    $usersSection = $('<section/>', {id: 'users-section'});
    
    $('<h3/>').text('Users').appendTo($usersSection);
    
    $userDataList = $('<ul/>');
    
    $userDataList.append(createDataListItem('Total Users', data.totalUsers));
    $userDataList.append(createDataListItem('Users Who Enrolled in Class', data.numUsersEnrolledInClass));
    $userDataList.append(createDataListItem('Unique Users Per Day', data.avgUniqueLoginsPerDay));
    
    $usersSection.append($userDataList);
    $analyticsTab.append($usersSection);
    
    // Section containing analytics data of classes
    $classesSection = $('<section/>', {id: 'classes-section'});
    
    $('<h3/>').text('Classes').appendTo($classesSection);
    
    $classesDataList = $('<ul/>');
    
    $classesDataList.append(createDataListItem('Active Classes', data.numClasses));
    $classesDataList.append(createDataListItem('Avg Users Per Class', data.avgUsersPerClass));
    $classesDataList.append(createDataListItem('Avg Rating For Class', data.avgClassRating));
    
    $classesSection.append($classesDataList);
    $analyticsTab.append($classesSection);
    
    $mainContent.append($analyticsTab);
}

/* Creates a data list item with `dataTitle` as the heading and `dataValue` as the text */
function createDataListItem(dataTitle, dataValue) {
    $listItem = $('<li/>');
    $('<h4/>').text(dataTitle).appendTo($listItem);
    
    $('<p/>').text(dataValue).appendTo($listItem);
    
    return $listItem;   
}

/* Shows the Users Tab */
function showUsersTab(deleteErrorMessage) {
    // Set selected tab
    selectTab('#users-tab', deleteErrorMessage);
    
    $mainContent = $('#main-content').empty();
    
    $usersTab = $('<section/>', {
        id: 'users-section'
    });
    
    // New User section
    $addUserSection = $('<section/>');
    
    $('<h3/>').text('New User').appendTo($addUserSection);
    
    $('<p/>').text('Create an account for a new user.').appendTo($addUserSection);
    
    $createAccountButton = $('<button/>', {
        id: 'create-account-button',
        'class': 'standard-blue-button',
        type: 'button'
    });
    $createAccountButton.click(showCreateUserForm);
    $createAccountButton.text('Create User Account');
    $createAccountButton.appendTo($addUserSection);
    
    $usersTab.append($addUserSection);
    
    // Current Users section
    $currentUsersSection = $('<section/>');
    
    $('<h3/>').text('Current Users').appendTo($currentUsersSection);
    $('<p/>').text('View or edit an existing user profile.').appendTo($currentUsersSection);
    
    // Search section
    $searchContainer = $('<article/>', {id: 'search-container'});

    $autocompleteDropDown = $('<section>', {id: 'autocomplete-drop-down'});
    
    $searchBox = $('<input/>', {type: 'text', placeholder: 'Search by user name    (e.g. type "Jeff")'});
    // Bind input changed listener to text box
    $searchBox.bind('input', function() {
       console.log($(this).val()); 
    });
    
    /* Autocomplete attributes for search box */
    $searchBox.autocomplete({
        serviceUrl: '/search',
        params: {type: 'usersbyusername', limit: 8}, // TODO: Should it by username or users name ?
        noCache: true, // don't use a cache
        minLength: 0,
        autoFocus: true,
        appendTo: $autocompleteDropDown,
        onSelect: function (suggestion) {
            // Navigate the to the edit user profile page
            window.location.href = '/admin/edit_user_profile/' + suggestion.data;
        }
    });
    
    $searchBox.appendTo($searchContainer);
    $autocompleteDropDown.appendTo($searchContainer);
    $searchContainer.appendTo($currentUsersSection);
    
    $usersTab.append($currentUsersSection);
    
    $mainContent.append($usersTab);    
}

/* Shows class tab */
function showClassTab() {
    // Set selected tab
    selectTab('#class-tab', true);
    
    $mainContent = $('#main-content').empty();
    
    // Edit / Delete class section
    $editClassSection = $('<section/>', {id: 'edit-class-section'});
    
    $('<h3/>').text('Edit or Delete an Existing class').appendTo($editClassSection);
    
    // Search section
    $searchContainer = $('<article/>', {id: 'search-container'});

    $autocompleteDropDown = $('<section>', {id: 'autocomplete-drop-down'});
    
    $searchBox = $('<input/>', {
        type: 'text',
        placeholder: 'Search by class name (e.g. "Intro")'
    });
    // Bind input changed listener to text box
    $searchBox.bind('input', function() {
       console.log($(this).val()); 
    });
    
    /* Autocomplete attributes for search box */
    $searchBox.autocomplete({
        serviceUrl: '/search',
        params: {type: 'classes', limit: 8}, // TODO: Should it by username or users name ?
        noCache: true, // don't use a cache
        minLength: 0,
        autoFocus: true,
        appendTo: $autocompleteDropDown,
        onSelect: function (suggestion) {
            // Navigate to the edit course page
            window.location.href = '/admin/edit_course/' + suggestion.data;
        }
    });
    
    $searchBox.appendTo($searchContainer);
    $autocompleteDropDown.appendTo($searchContainer);
    
    $searchContainer.appendTo($editClassSection);

    $mainContent.append($editClassSection);
}

/* Shows Create User form */
function showCreateUserForm() {
    /* Remove any existng error message while trying to create a user */
   removeErrorMessage();
    
   var $popup = $('<article/>', {id: 'popup'});
    
    $outer = $('<div/>', {
       id:  'signup_form'
    });
    
    $middle = $('<div/>', {
       class:  'col-md-6'
    });
    
    $container = $('<div/>', {
       class:  'standard-container'
    });
    
    $cancelwrapper = $('<div/>');
    
    $cancelicon = $('<span/>', {
       class:  'glyphicon glyphicon-remove cancel_icon'
    });
    
    $cancelicon.click(hidePopup);
    $cancelwrapper.append($cancelicon);
    
    $container.append($cancelwrapper);
    
    $form = $('<form/>', {id: 'create_user_form', action: '/admin/create_user', method: 'POST'});
    
    $title = $('<h1/>',{
        class : 'standard-title'
    });
    $title.text('Create User').appendTo($form);
    
    $input = $('<input/>',{
        id : 'name_field',
        name : 'name',
        type : 'text',
        placeholder : 'Name',
        required : 'required',
        class : 'standard-input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'username_field',
        name : 'username',
        type : 'text',
        placeholder : 'Username',
        required : 'required',
        class : 'standard-input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'user_password_field',
        name : 'password',
        type : 'password',
        placeholder: 'Password',
        required : 'required',
        pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&\\-])[A-Za-z\\d$@$!%*#?&\\-]{8,}$',
        title: 'Password must contain at least 1 letter, 1 number, 1 special character, ' +
               ' and must be between 6 and 20 characters long. Special characters include $@!%*#?&-',
        class : 'standard-input'
    });
    
    $input.on('input', hidePasswordMismatchMessage);
    $input.appendTo($form);
    
    $confirmPasswordInput = $('<input/>',{
        id : 'confirm_password_field',
        name : 'passwordConfirmation',
        type : 'password',
        placeholder : 'Password Comfirmation',
        required : 'required',
        class : 'standard-input'
    });
    
    $confirmPasswordInput.on('input', hidePasswordMismatchMessage);
    $confirmPasswordInput.appendTo($form);
    
    $errorMessage = $('<p>', {class: 'password-mismatch-message'});
    $errorMessage.text('Passwords don\'t match');
    $errorMessage.css('display', 'none');
    $errorMessage.appendTo($form);
    
    $submitButton = $('<input/>',{
        type : 'submit',
        value : 'Create',
        class : 'standard-blue-button block_btn'
    });
    
    $submitButton.click(validateCreateUserInput);
    
    $submitButton.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
    
    $('#main-content').append($popup);
}

function validateCreateUserInput() {
    $confirmPasswordField = $('#confirm_password_field');
    
    var fieldsEmpty = false;
    if ($('#name_field').val().length === 0) {
        fieldsEmpty = true;
    }

    else if ($('#username_field').val().length === 0) {
        fieldsEmpty = true;
    }

    else if ($('#user_password_field').val().length === 0) {
        fieldsEmpty = true;
    }
    
    else if ($confirmPasswordField.val().length === 0) {
        fieldsEmpty = true;
    }
    
    // Let the browser handle empty fields
    if (fieldsEmpty) {
        return true;
    }
    
    // Check if passwords match
    if ($('#user_password_field').val() !== $confirmPasswordField.val()) {
        
        // Show password mismatch messsage
        $errorMessage = $('p.password-mismatch-message');
        $errorMessage.css('display', 'block');
        return false;
    }
    /* The other fields are validated by the browser based on the
     * `pattern` / `required` attributes
     */
    return true;
}

function hidePasswordMismatchMessage() {
    $errorMessage = $('p.password-mismatch-message');
    $errorMessage.css('display', 'none');
}

function hidePopup() {
    $('#popup').remove();
}

function selectTab(id, deleteErrorMessage) {
    unSelectAllTabs(deleteErrorMessage);
    
    // Set selected tab
    $(id).addClass('selected-tab');
}

function unSelectAllTabs(deleteErrorMessage) {
    $('#analytics-tab').removeClass('selected-tab');
    $('#users-tab').removeClass('selected-tab');
    $('#class-tab').removeClass('selected-tab');
    
    if (deleteErrorMessage) {
        removeErrorMessage();
    }
}

/* Removes any error message displayed at the top of the page */
function removeErrorMessage() {
    $('#error-message').remove();
}
