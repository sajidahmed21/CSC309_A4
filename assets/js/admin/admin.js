$(document).ready(function() {
    //showAnalyticsTab();
    showUsersTab();
});

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
        type: 'button'
    });
    $createAccountButton.text('Create User Account');
    $createAccountButton.appendTo($addUserSection);
    
    $usersTab.append($addUserSection);
    
    // Current Users section
    $currentUsersSection = $('<section/>');
    
    $('<h3/>').text('Current Users').appendTo($currentUsersSection);
    $('<p/>').text('View or edit an existing user profile.').appendTo($currentUsersSection);
    $('<input/>', {type: 'text', placeholder: 'Search by user name'}).appendTo($currentUsersSection);
    
    $usersTab.append($currentUsersSection);
    
    $mainContent.append($usersTab);
    
    
}

