$(document).ready(function() {
    showAnalyticsTab(false);
    attachClickListeners();
});

function attachClickListeners() {
    $('#analytics-tab').click(function() {
        showAnalyticsTab(true);
    });
    $('#users-tab').click(showUsersTab);
    $('#class-tab').click(showClassTab);
}

function showAnalyticsTab(refreshPage) {
    if (refreshPage) {
        // Reload page to refresh data
        window.location.href = "/admin";
        return;
    }
    // Set selected tab
    selectTab('#analytics-tab');
    
    $mainContent = $('#main-content').empty();
    
    $analyticsTab = $('<section/>', {id: 'analytics-section'});
    
    // Section containing analytics data of users
    $usersSection = $('<section/>', {id: 'users-section'});
    
    $('<h3/>').text('Users').appendTo($usersSection);
    
    $userDataList = $('<ul/>');
    
    // Mock Date
    var numUsers = 27;
    var numUniqueUsersEnrolledInClass = 13;
    var avgUniqueUsersPerDay = 21;
    
    $userDataList.append(createDataListItem('Total Users', numUsers));
    $userDataList.append(createDataListItem('Users Enrolled in Class', numUniqueUsersEnrolledInClass));
    $userDataList.append(createDataListItem('Unique Users Per Day', avgUniqueUsersPerDay));
    
    $usersSection.append($userDataList);
    $analyticsTab.append($usersSection);
    
    // Section containing analytics data of classes
    $classesSection = $('<section/>', {id: 'classes-section'});
    
    $('<h3/>').text('Classes').appendTo($classesSection);
    
    $classesDataList = $('<ul/>');
    
    // Mock data
    var totalActiveClasses = 10;
    var avgNumberOfUsersPerClass = 11.2;
    var avgRatingForClass = 4.2;
    
    $classesDataList.append(createDataListItem('Active Classes', totalActiveClasses));
    $classesDataList.append(createDataListItem('Avg Users Per Class', avgNumberOfUsersPerClass));
    $classesDataList.append(createDataListItem('Avg Rating For Class', avgRatingForClass));
    
    $classesSection.append($classesDataList);
    $analyticsTab.append($classesSection);
    
    $mainContent.append($analyticsTab);
}

function createDataListItem(dataTitle, dataValue) {
    $listItem = $('<li/>');
    $('<h4/>').text(dataTitle).appendTo($listItem);
    
    $('<p/>').text(dataValue).appendTo($listItem);
    
    return $listItem;   
}

function showUsersTab() {
    // Set selected tab
    selectTab('#users-tab');
    
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
    
    $searchBox.autocomplete({
        lookup: ['Jeff', 'Jeffrey', 'Terry', 'Johnson', 'Rob'],
        minLength: 0,
        autoFocus: true,
        appendTo: $autocompleteDropDown,
        onSelect: function (suggestion) {
            console.log(suggestion);
            window.location.href = 'edit-profile-admin.html';
        }
    });
    
    $searchBox.appendTo($searchContainer);
    $autocompleteDropDown.appendTo($searchContainer);
    $searchContainer.appendTo($currentUsersSection);
    
    $usersTab.append($currentUsersSection);
    
    $mainContent.append($usersTab);    
}

function showClassTab() {
    // Set selected tab
    selectTab('#class-tab');
    
    $mainContent = $('#main-content').empty();
    
    // Edit / Delete class section
    $editClassSection = $('<section/>', {id: 'edit-class-section'});
    
    $('<h3/>').text('Edit or Delete an Existing class').appendTo($editClassSection);
    
    // Search section
    $searchContainer = $('<article/>', {id: 'search-container'});

    $autocompleteDropDown = $('<section>', {id: 'autocomplete-drop-down'});
    
    $searchBox = $('<input/>', {
        type: 'text',
        placeholder: 'Search by class name    (e.g. type "Intro")'
    });
    // Bind input changed listener to text box
    $searchBox.bind('input', function() {
       console.log($(this).val()); 
    });
    
    var classNames = ['Introduction to Programming', 'Introduction to Data Structures',
                   'Introduction to Religion', 'Introduction to Arthictecture'];
    
    $searchBox.autocomplete({
        lookup: classNames,
        minLength: 0,
        autoFocus: true,
        appendTo: $autocompleteDropDown,
        onSelect: function (suggestion) {
            console.log(suggestion);
            window.location.href = 'edit-coursedesc-admin.html';
        }
    });
    
    $searchBox.appendTo($searchContainer);
    $autocompleteDropDown.appendTo($searchContainer);
    
    $searchContainer.appendTo($editClassSection);

    $mainContent.append($editClassSection);
}

function showCreateUserForm() {
   var $popup = $('<article/>', {id: 'popup'});
    //$popup.empty();
    
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
    $cancelicon.click(function(){
        hidePopup();
    });
    $cancelwrapper.append($cancelicon);
    
    $container.append($cancelwrapper);
    
    $form = $('<form/>', {action: 'edit-profile-admin.html', method: 'GET'});
    
    $title = $('<h1/>',{
        class : 'standard-title'
    });
    $title.text('Create User').appendTo($form);
    
    $input = $('<input/>',{
        id : 'userName',
        name : 'userName',
        type : 'text',
        placeholder : 'Username',
        required : 'required',
        class : 'standard-input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'userPassword',
        name : 'userPassword',
        type : 'password',
        placeholder : 'Password',
        required : 'required',
        class : 'standard-input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'userPasswordConfirm',
        name : 'userPasswordConfirm',
        type : 'password',
        placeholder : 'Password Comfirmation',
        required : 'required',
        class : 'standard-input'
    });
    
    $input.appendTo($form);
    
    $input = $('<input/>',{
        id : 'userEmail',
        name : 'userEmail',
        type : 'email',
        placeholder : 'Email',
        required : 'required',
        class : 'standard-input'
    });
    
    $input.appendTo($form);
    
    $submitButton = $('<input/>',{
        type : 'submit',
        value : 'Create',
        class : 'standard-blue-button block_btn'
    });
    
    $submitButton.appendTo($form);
    
    $form.appendTo($container);
    $container.appendTo($middle);
    $middle.appendTo($outer);
    $outer.appendTo($popup);
    
    $('#main-content').append($popup);
}

function hidePopup() {
    $('#popup').empty();
}

function selectTab(id) {
    unSelectAllTabs();
    // Set selected tab
    $(id).addClass('selected-tab');
}

function unSelectAllTabs() {
    $('#analytics-tab').removeClass('selected-tab');
    $('#users-tab').removeClass('selected-tab');
    $('#class-tab').removeClass('selected-tab');
}

