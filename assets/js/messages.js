/* Hides all conversations except the one for the given partner id.
 * If no chat area exists for the given partner id, one will be created.
 *
 * Returns true if a chat area existed and false otherwise.
 */
function showConversation(partnerId) {
    var $conversations = $('section#chat-area div.conversation');
    
    var foundTarget = false;
    
    $conversations.each(function(index, conversation) {
        var $conversation = $(conversation);
        
        if ($conversation.attr('data-partner-id') === partnerId) {
            foundTarget = true;
            $conversation.show();
        }
        else {
            $conversation.hide();
        }
    });
    
    return foundTarget;
}


function onClickUser(user) {
    var userId = $(user).attr('data-user-id');
    
    // if the user is already being shown, do nothing
    if (userId === window.currentPartnerId) {
        return;
    }
    
    window.currentPartnerId = userId;
    
    // otherwise, show the chat area
    if (showConversation(userId)) {
        // if the chat area already existed, do nothing
        ;
    }
    else {
        // this is a new chat area, so load previous messages?
    }
    
    return;
}


/* Resizes the main messaging area so that it uses the entire available height */
function resizeMessagingArea() {
    // calculate the used height
    var $elements = $('body > *:not(main#messaging)');
    
    var usedHeight = 0;
    $elements.each(function(index, element) {
        // include the margin in the calculation
        usedHeight += $(element).outerHeight(true);
    });
    
    // set the height of the messaging area
    var availableMessagingHeight = $(window).height() - usedHeight;
    $('main#messaging').height(availableMessagingHeight);
    
    // next, calculate the available area for conversations
    var conversationHeight = availableMessagingHeight;
    conversationHeight -= $('section#chat-area div#message-send-area').outerHeight();
    
    // convert to a string with px
    conversationHeight += 'px';
    
    // finally, set the minimum height of all conversations, so that the 
    // send area is pushed down correctly
    $('section#chat-area div.conversation').each(function(index, conversation) {
        conversation.style.minHeight = conversationHeight;
    });
    
    return;
}


window.onload = function() {
    // set the resizing of the messaging area and trigger it immediately
    $(window).resize(resizeMessagingArea);
    resizeMessagingArea();
    
    // set the cick event for all user in the users list
    $('section#user-list div.user').each(function(index, user) {
        $(user).click(function(e) {
            onClickUser(user);
            
            e.preventDefault();
        });
    });
    
    // load the first chat area (which for the mockup is hiding all
    // chat areas except the first
    onClickUser(document.getElementsByClassName('user')[0]);
}