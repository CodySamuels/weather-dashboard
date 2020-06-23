// RETRIEVES SIDEBAR DATA FROM LOCAL STORAGE
var cityArray = JSON.parse(localStorage.getItem("cityData")) || [];

// RUN ON PAGE LOAD
renderSideBar();

// FUNCTIONS
function renderTables(cityName) {

    // QUERY VARIABLES
    var APIKey = "20139dab005aa19921ee9f2798f4a2e7";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + APIKey;

    // DOM MANIPULATION TO MAKE THE PAGE LOOK BETTER
    $("main").removeClass("container")
    $("main").addClass("container-fluid")
    $("aside").removeClass("col-md")
    $("aside").addClass("col-md-2")
    $("article").addClass("col-md")
    $("#weatherStatsElement").show()
    $("#forecastStatsElement").show()
    
// FIRST QUERY TO GET LATITUDE/LONGITUDE
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            var cityLat = response.city.coord.lat;
            var cityLong = response.city.coord.lon;
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&units=imperial&exclude=minutely,hourly&appid=" + APIKey

            // ADDS THE CITY NAME TO THE HEADER
            $("#cityHeaderName").text(cityName)

            // SECOND QUERY TO GET THE REST OF THE DETAILS.
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {

                    // VARIABLES FOR MANIPULATION.
                    var currentDate = moment().format("MMM Do, YYYY");
                    var uviInt = parseInt(response.current.uvi)

                    // POPULATES THE MAIN ARTICLE WITH DATA.
                    $("#cityHeaderDate").text("(" + currentDate + ")");
                    $("#cityHeaderImg").attr("src", "http://openweathermap.org/img/wn/" + (response.current.weather[0].icon) + ".png");
                    $("#cityTemperature").text("Temperature: " + response.current.temp + " °F");
                    $("#cityHumidity").text("Humidity: " + response.current.humidity + "%");
                    $("#cityWindSpeed").text("Wind Speed: " + response.current.wind_speed + " mph");
                    $("#cityUVIButton").text(response.current.uvi);
                    $("#cityUVIButton").removeClass();

                    // COLORS THE UV INDEX BUTTON BASED OFF SEVERITY
                    if (uviInt < 2) {
                        $("#cityUVIButton").addClass("greenLowUVIButton btn");
                    } else if (uviInt > 2 && uviInt <= 5) {
                        $("#cityUVIButton").addClass("yellowModerateUVIButton btn");
                    } else if (uviInt > 5 && uviInt <= 7) {
                        $("#cityUVIButton").addClass("orangeHighUVIButton btn");
                    } else if (uviInt > 7 && uviInt <= 10) {
                        $("#cityUVIButton").addClass("redVeryHighUVIButton btn");
                    } else if (uviInt >= 11) {
                        $("#cityUVIButton").addClass("violetExtremeUVIButton btn");
                    };

                    // LOOP THAT POPULATES THE CARDS
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

    // EMPTIES THE SIDEBAR SO THAT YOU DON'T GET DOUBLES.
    $("#cityList").empty();

    // LOOP THAT POPULATES SIDEBAR
    for (let i = 0; i < cityArray.length; i++) {

        // NEW LIST ITEM WITH NESTED DELETE BUTTON CREATED
        var newLi = $("<li>");
        var deleteButton = $("<button>")
        var deleteButtonInside = $("<i>")

        // ADDS CLASSES TO THE NEWLY CREATED ELEMENTS
        newLi.addClass("list-group-item d-flex justify-content-between align-items-center");
        deleteButton.addClass("btn btn-danger")
        deleteButtonInside.addClass("fas fa-times")

        // ADDS IDS TO THE NEWLY CREATED ELEMENTS
        newLi.attr("id", ("city" + [i]))
        deleteButton.attr("id", ("deleteButton" + [i]))

        // APPENDS THEM TO PAGE
        newLi.text(cityArray[i]);
        newLi.append(deleteButton)
        deleteButton.append(deleteButtonInside)
        $("#cityList").append(newLi)

        // ADDS EVENT LISTENERS TO THE ITEMS THAT RUN RENDER TABLES WITH THE CITY NAME
        $("#city" + [i]).on("click", function (event) {

            var cityInput = (cityArray[i])

            renderTables(cityInput)
        });

        // EVENT LISTENER THAT REMOVES AN ITEM FROM THE SIDEBAR
        $("#deleteButton" + [i]).on("click", function (event) {
           cityArray.splice(i, 1)
           renderSideBar();
        });
    }
};

// SEARCH BAR EVENT LISTENER. POPUPLATES SIDEBAR WITH USER INPUT
$("#searchButton").on("click", function (event) {
    event.preventDefault();

    var cityInput = $("#searchBar").val().trim();

    cityArray.push(cityInput);
    localStorage.setItem("cityData", JSON.stringify(cityArray))
    renderSideBar();
    $("#searchBar").val("")
});