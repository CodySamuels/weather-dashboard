// IDS TO KNOW


// cityList


// GLOBAL VARIABLES
var APIKey = "20139dab005aa19921ee9f2798f4a2e7";
// var cityName = "Seattle";
var cityLat = "";
var cityLong = "";
// var plzSendHelp = "";
// var plzSendHelp2 = "";
var imgToAttach = "";
var cityArray = ["Seattle", "Whitewright"];

// renderTables();
renderSideBar();



// FUNCTIONS
function renderTables(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            cityLat = response.city.coord.lat;
            cityLong = response.city.coord.lon;
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&units=imperial&exclude=minutely,hourly&appid=" + APIKey
            plzSendHelp = response
            $("#cityHeader").text(cityName)

            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {
                    plzSendHelp2 = response
                    $("#cityTemperature").text("Temperature: " + response.current.temp + " F");
                    $("#cityHumidity").text("Humidity: " + response.current.humidity + "%");
                    $("#cityWindSpeed").text("Wind Speed: " + response.current.wind_speed + "mph");
                    $("#cityUVIndex").text("UV Index: " + response.current.uvi);

                    for (let i = 0; i <= 4; i++) {
                        $("#card" + i + "Temperature").text("Temperature: " + response.daily[i].temp.day + " F");
                        $("#card" + i + "Humidity").text("Humidity: " + response.daily[i].humidity + "%");
                        imgToAttach = response.daily[i].weather[0].icon
                        $("#card" + i + "Img").attr("src", "http://openweathermap.org/img/wn/"+ imgToAttach + ".png");
                    }
                });
        });
}
function renderSideBar() {
    $("#cityList").empty();
for (let i = 0; i < cityArray.length; i++) {
    var newLi = $("<li>");
    newLi.addClass("list-group-item");
    newLi.attr("id", ("city"+[i]))
    newLi.text(cityArray[i]);
    $("#cityList").append(newLi)
}
}

// EVENT LISTENERS
$("#searchButton").on("click", function(event) {
    event.preventDefault();
    var cityInput = $("#searchBar").val().trim();
    cityArray.push(cityInput);
    renderSideBar();
});

for (let i = 0; i < cityArray.length; i++) {
    $("#city"+[i]).on("click", function(event) {
        var cityInput = cityArray[i]
        // console.log(cityInput);
        renderTables(cityInput)
    });
}