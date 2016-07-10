$(document).ready(function() {
    //showAnalyticsTab();
    attachClickListeners();
    showUsersTab();
});

function attachClickListeners() {
    $('#analytics-tab').click(showAnalyticsTab);
    $('#users-tab').click(showUsersTab);
    $('#class-tab').click(showClassTab);
}

function showAnalyticsTab() {
    $mainContent = $('#main-content').empty();
    
    // TODO: 
    $('<p/>').text('Will add soon..').appendTo($mainContent);
}

function showUsersTab() {
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

