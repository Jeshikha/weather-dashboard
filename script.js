const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKEY = "c875f84aa04328bd581f57209854f1e5";

// Define variables to store DOM elements
let searchForm = $("#search-form");
let searchInput = $("#search-input");
let todaySection = $("#today");
let forecastSection = $("#forecast");
let searchHistory = [];
let searchHistoryContainer = $("#history");

// Function to render the search history
function renderSearchHistory() {
    searchHistoryContainer.html("");
    for (let i = 0; i < searchHistory.length; i++) {
        let btn = $("<button>");
        btn.attr("type", "button");
        btn.addClass("history-btn btn-history");
        btn.attr("data-search", searchHistory[i]);
        btn.text(searchHistory[i]);
        searchHistoryContainer.append(btn);
    }
}

// Function to append a city to the search history
function appendSearchHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    renderSearchHistory();
}

// Function to render the current weather
function renderCurrentWeather(city, weatherData) {
    let date = moment().format("D/M/YYYY");
    let tempC = weatherData["main"]["temp"];
    let windKph = weatherData["wind"]["speed"];
    let humidity = weatherData["main"]["humidity"];

    let iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    let iconDescription = weatherData.weather[0].description || weatherData[0].main;
    let card = $("<div>");
    let cardBody = $("<div>");
    let weatherIcon = $("<img>");
    let heading = $("<h2>");
    let tempEl = $("<p>");
    let windEl = $("<p>");
    let humidityEl = $("<p>");

    card.attr("class", "card");
    cardBody.attr("class", "card-body");
    card.append(cardBody);
    heading.attr("class", "h3 card-title");
    tempEl.attr("class", "card-text");
    windEl.attr("class", "card-text");
    humidityEl.attr("class", "card-text");

    heading.text(`${city} (${date})`);
    weatherIcon.attr("src", iconUrl);
    weatherIcon.attr("alt", iconDescription);

    heading.append(weatherIcon);
    tempEl.text(`Temp: ${tempC} °C`);
    windEl.text(`Wind: ${windKph} Km/H`);
    humidityEl.text(`Humidity: ${humidity} %`);
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todaySection.html("");
    todaySection.append(card);
}

// Function to render the 5-day forecast
function renderForecast(weatherData) {
    let headingCol = $("<div>");
    let heading = $("<h4>");

    headingCol.attr("class", "col-12");
    heading.text("5-day forecast");
    headingCol.append(heading);

    forecastSection.html("");

    forecastSection.append(headingCol);

    let futureForecast = weatherData.filter(function (forecast) {
        return forecast.dt_txt.includes("12:00:00");
    });

    for (let i = 0; i < futureForecast.length; i++) {
        let iconUrl = `https://openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`;
        let iconDescription = futureForecast[i].weather[0].description;
        let tempC = futureForecast[i].main.temp;
        let humidity = futureForecast[i].main.humidity;
        let windKph = futureForecast[i].wind.speed;

        let col = $("<div>");
        let card = $("<div>");
        let cardBody = $("<div>");
        let weatherIcon = $("<img>");
        let tempEl = $("<p>");
        let windEl = $("<p>");
        let humidityEl = $("<p>");

        col.append(card);
        card.append(cardBody);
        cardBody.append(tempEl, windEl, humidityEl);

        col.attr("class", "col-md");
        card.attr("class", "card bg-primary h-100 text-white");
        tempEl.attr("class", "card-text");
        windEl.attr("class", "card-text");
        humidityEl.attr("class", "card-text");

        cardBody.prepend(weatherIcon); // Add the weather icon at the beginning
        cardBody.append(tempEl, windEl, humidityEl);

        tempEl.text(`Temp: ${tempC} °C`);
        windEl.text(`Wind: ${windKph} Km/H`);
        humidityEl.text(`Humidity: ${humidity} %`);
        weatherIcon.attr("src", iconUrl);
        weatherIcon.attr("alt", iconDescription);

        forecastSection.append(col);
    }
}

// Function to fetch weather data
function fetchWeather(location) {
    let latitude = location.lat;
    let longitude = location.lon;
    let city = location.name;
    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKEY}`;
    $.ajax({
        url: queryWeatherURL,
        method: "GET"
    }).then(function (response) {
        renderCurrentWeather(city, response.list[0]);
        renderForecast(response.list);
    });
}

// Function to fetch coordinates of a city
function fetchCoord(search) {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKEY}`;
    fetch(queryURL, { method: "GET" })
        .then(function (data) {
            return data.json();
        })
        .then(function (response) {
            if (!response[0]) {
                alert("No Location Found");
            } else {
                appendSearchHistory(search);
                fetchWeather(response[0]);
            }
        });
}

// Function to initialize search history
function initializeHistory() {
    let storedHistory = localStorage.getItem("search-history");

    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

// Function to handle form submission
function submitSearchForm(event) {
    event.preventDefault();
    let search = searchInput.val().trim();

    fetchCoord(search);
    searchInput.val("");
}

// Function to handle clicks on search history items
function clickSearchHistory(event) {
    if (!$(event.target).hasClass("btn-history")) {
        return;
    }
    let search = $(event.target).attr("data-search");

    fetchCoord(search);
    searchInput.val("");
}

// Initialize search history and set up event listeners
initializeHistory();
searchForm.on("submit", submitSearchForm);
searchHistoryContainer.on("click", clickSearchHistory);