$(document).ready(function() {
    showAnalyticsTab();
    attachClickListeners();
});

function attachClickListeners() {
    $('#analytics-tab').click(showAnalyticsTab);
    $('#users-tab').click(showUsersTab);
    $('#class-tab').click(showClassTab);
}

function showAnalyticsTab() {
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
        'class': 'admin-page-button',
        type: 'button'
    });
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
            window.location.href = 'file:///Users/ugo/Sajid/Courses/CSC309/A4/CSC309_A4/edit-profile-admin.html';
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
        }
    });
    
    $searchBox.appendTo($searchContainer);
    $autocompleteDropDown.appendTo($searchContainer);
    
    $searchContainer.appendTo($editClassSection);

    $mainContent.append($editClassSection);
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

