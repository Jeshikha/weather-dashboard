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

function renderCurrentWeather(city, weatherData) {
    let date = moment().format("D/M/YYYY");
    let tempC = weatherData["main"]["temp"];
    let windKph = weatherData["wind"]["speed"];
    let humidity = weatherData["main"]["humidity"];

    let iconUrl = `https://opemweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    let iconDescription = weatherData.weather[0].description || weatherData[0].main
    let card = $("<div>")
    let cardBody = $("<div>")
    let weatherIcon = $("<img")
    let heading = $("<h2>")
    let tempEl = $("<p>")
    let windEl = $("<p>")
    let humidityEl = $("<p>")

    card.attr("class", "card");
    cardBody.attr("class", "card-body");
    card.append(cardBody);
    heading.attr("class", "h3 card-title")
    tempEl.attr("class", "card-text")
    windEl.attr("class", "card-text")
    humidityEl.attr("class", "card-text");

    heading.text(`${city}(${date})`)
    weatherIcon.attr("src", iconUrl)
    weatherIcon.attr("alt", iconDescription);

    heading.append(weatherIcon);
    tempEl.text(`Temp ${tempC} C`)
    windEl.text(`Wind ${windKph} KPH`);
    humidityEl.text(`Humidity ${humidity} %`)
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todaySection.html("");
    todaySection.append(card);


}
function fetchWeather(location) {
    let latitude = location.lat;
    let longitude = location.lon;
    let city = location.name;
    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKEY}`;
    console.log(queryWeatherURL);
    $.ajax({
        url: queryWeatherURL,
        method: "GET"
    }).then(function (response) {
        renderCurrentWeather(city, response.list[0]);
        renderForecast(data.list);
    })
}

function fetchCoord(search) {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKEY}`;
    console.log(queryURL);
    fetch(queryURL, { method: "GET" })
        .then(function (data) {
            return data.json()
        })
        .then(function (response) {
            if (!response[0]) {
                alert("No Location Found")
            } else {
                appendSearchHistory(search)
                fetchWeather(response[0])

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

function clickSearchHistory(event) {
    if (!$(event.target).hasClass("btn-history")) {
        return
    }
    let search = $(event.target).attr("data-search")

    fetchCoord(search);
    searchInput.val("");

}
searchForm.on("submit", submitSearchForm);
searchHistoryContainer.on("click", clickSearchHistory)