/* Hides all chat area sections except the one for the given partner id.
 * If no chat area exists for the given partner id, one will be created.
 *
 * Returns true if a chat area existed and false otherwise.
 */
function showChatArea(partnerId) {
    var $chatAreas = $('section.chat');
    
    var foundTarget = false;
    
    $chatAreas.each(function(index, chatArea) {
        var $chatArea = $(chatArea);
        
        if ($chatArea.attr('data-partner-id') == partnerId) {
            foundTarget = true;
            $chatArea.show();
        }
        else {
            $chatArea.hide();
        }
    });
    
    return foundTarget;
}


window.onload = function() {
    // load the first chat area (which for the mockup is hiding all
    // chat areas except the first
    showChatArea(41);
}