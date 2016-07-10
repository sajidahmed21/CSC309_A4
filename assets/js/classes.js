function search() {
    var searchText = $('input#search').val();
    
    // if the text didn't change, don't do anything
    if (searchText === window.lastSearchText) {
        return;
    }
    
    console.log('search triggered for: [' + searchText + ']');
    
    // otherwise, set the last search and and update as needed
    window.lastSearchText = searchText;
    if (searchText === '') {
        $('main').addClass('no-search');
    }
    else {
        // run the search
        $('main').removeClass('no-search');
    }
}


window.onload = function() {
    $('input#search').on('change keyup paste mouseup', search);
    
    window.lastSearchText = '';
}