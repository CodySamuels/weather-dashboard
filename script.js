// GLOBAL VARIABLES
var cityArray = JSON.parse(localStorage.getItem("cityData")) || [];

// RUN ON PAGE LOAD
renderSideBar();

// FUNCTIONS
function renderTables(cityName) {

    var APIKey = "20139dab005aa19921ee9f2798f4a2e7";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + APIKey;

    $("#weatherStatsElement").show()
    $("#forecastStatsElement").show()

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            var cityLat = response.city.coord.lat;
            var cityLong = response.city.coord.lon;
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&units=imperial&exclude=minutely,hourly&appid=" + APIKey

            $("#cityHeaderName").text(cityName)

            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {

                    var currentDate = moment().format("MMM Do, YYYY");
                    var uviInt = parseInt(response.current.uvi)

                    $("#cityHeaderDate").text("(" + currentDate + ")");
                    $("#cityHeaderImg").attr("src", "http://openweathermap.org/img/wn/" + (response.current.weather[0].icon) + ".png");
                    $("#cityTemperature").text("Temperature: " + response.current.temp + " °F");
                    $("#cityHumidity").text("Humidity: " + response.current.humidity + "%");
                    $("#cityWindSpeed").text("Wind Speed: " + response.current.wind_speed + " mph");
                    $("#cityUVIButton").text(response.current.uvi);
                    $("#cityUVIButton").removeClass();

                    if (uviInt <= 2) {
                        $("#cityUVIButton").addClass("greenlowUVIButton btn");
                    } else if (uviInt > 2 && uviInt <= 5) {
                        $("#cityUVIButton").addClass("yellowModerateUVIButton btn");
                    } else if (uviInt > 5 && uviInt <= 7) {
                        $("#cityUVIButton").addClass("orangeHighUVIButton btn");
                    } else if (uviInt > 7 && uviInt <= 10) {
                        $("#cityUVIButton").addClass("redVeryHighUVIButton btn");
                    } else if (uviInt >= 11){
                        $("#cityUVIButton").addClass("violetExtremeUVIButton btn");
                    };

                    for (let i = 0, x = 1; i <= 4; i++, x++) {
                        currentDate = moment().add(x, 'days').format("MM/DD/YYYY")
                        var imgToAttach = response.daily[i].weather[0].icon

                        $("#card" + i + "Date").text(currentDate)
                        $("#card" + i + "Temperature").text("Temperature: " + response.daily[i].temp.day + " °F");
                        $("#card" + i + "Humidity").text("Humidity: " + response.daily[i].humidity + "%");
                        $("#card" + i + "Img").attr("src", "http://openweathermap.org/img/wn/" + imgToAttach + ".png");
                    };
                });
        });
};

function renderSideBar() {

    $("#cityList").empty();

    for (let i = 0; i < cityArray.length; i++) {
        var newLi = $("<li>");

        newLi.addClass("list-group-item");
        newLi.attr("id", ("city" + [i]))
        newLi.text(cityArray[i]);

        $("#cityList").append(newLi)
        $("#city" + [i]).on("click", function (event) {

            var cityInput = (cityArray[i])

            renderTables(cityInput)
        });
    }
};

// EVENT LISTENERS
$("#searchButton").on("click", function (event) {
    event.preventDefault();

    var cityInput = $("#searchBar").val().trim();

    cityArray.push(cityInput);
    localStorage.setItem("cityData", JSON.stringify(cityArray))
    renderSideBar();
});