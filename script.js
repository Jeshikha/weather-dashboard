const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKEY = "c875f84aa04328bd581f57209854f1e5";

// Define variables to store DOM elements
let searchForm = $("#search-form");
let searchInput = $("#search-input");
let todaySection = $("#today");
let forecastSection = $("#forecast");
let searchHistory = [];
let searchHistoryContainer = $("#history");

function renderSearchHistory() {
    searchHistoryContainer.html("");
    for (let i = 0; i < searchHistory.length; i++) {
        let btn = $("<button>");
        btn.attr("type", "button")
        btn.addClass("history-btn btn-history")
        btn.attr("dta-search", searchHistory[i])
        btn.text(searchHistory[i])
        searchHistoryContainer.append(btn)
    }
}

function appendSearchHistory() {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    renderSearchHistory()

}


function fetchCoord(search) {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKEY}`;
    fetch(queryURL, { method: "GET" }).then(function (data) {
        return data.json()
    }).then(function (response) {
        if (!response[0]) {
            alert("No Location Found")
        } else {
            appendSearchHistory(search)
            fetchWeather(response)

        }
    });

}
function initializeHistory() {
    let storedHistory = localStorage.getItem("search-history");

    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory()
}

function submitSearchForm(event) {
    event.preventDefault();
    let search = searchInput.val().trim()

    fetchCoord(search);
    searchInput.val("");

}

searchForm.on("submit", submitSearchForm);