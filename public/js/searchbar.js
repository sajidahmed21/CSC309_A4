/* Shows the conversation with the user of the selected suggestion. If the
 * conversation does not exist, one will be created.
 */
function onSelectSearchSuggestion(suggestion) {
    // construct the uri depending on the type of the suggestion
    var href = suggestion.type === 'user' ? '/user/profile/' : '/course/';
    href += suggestion.data;

    window.location.href = href;
}

/* Initialise the search once the document is ready. */
$(function () {
    $('input#search-text').autocomplete({
        serviceUrl: '/search',
        params: {
            limit: 8
        },
        minLength: 0,
        autoFocus: true,
        appendTo: $('div#search-dropdown'),
        onSelect: onSelectSearchSuggestion,
        showNoSuggestionNotice: true
    });
});