let searchInput = $("#search-input");
let searchForm = $("#search-form");

function submitSearchForm(event) {
    event.preventDefault();
    // alert(searchInput.val().trim())
    let search = searchInput.val().trim()
}

searchForm.on("submit", submitSearchForm);