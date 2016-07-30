$(document).ready(function () {

    // Remove invalid credentials message when admin tries to re-type password
    $('form > input').on('input', hidePasswordMismatchMessage);
});

/* Remove any 'invalid' credentials' message from the UI */
function hidePasswordMismatchMessage() {
    $errorMessage = $('p.password-mismatch-message');
    $errorMessage.css('display', 'none');
}