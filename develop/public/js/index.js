const APIKey = "5P33fDg7Tt7vuEz6sL29Bd9KETzuqvLDV8oaUS5NIIM";
const resultGridAll = document.getElementById("result-grid-all");
const btnHotel = document.getElementById("btn-hotel");
const btnFood = document.getElementById("btn-food");
const btnActivity = document.getElementById("btn-activity");
const buttonsEl = document.querySelector("search-section");

let selectValue = document.querySelector("#city");
let city = "";

//code for date picker
const startDateInput = document.getElementById("start-date-input");
const endDateInput = document.getElementById("end-date-input");
const startDate = startDateInput.value;
const endDate = endDateInput.value;

//setting up the cities and their lat/long
cityLookup = {
    "Charleston": "32.7876,-79.9402",
    "Santa Fe": "35.6876,-105.9384",
    "Savannah": "32.0564,-81.0951",
    "New Orleans": "29.9759,-90.0782",
    "NYC": "40.7127,-74.0060",
    "San Antonio": "29.4246,-98.4951",
    "Chicago": "41.8755,-87.6244",
    "Portland": "45.5202,-122.6741",
    "Williamsburg": "37.2708,-76.7074",
    "Honolulu": "21.3045,-157.8556"
}

//sets up the drop down menu on the html page for the cities
let selectList = selectValue;

for (let key in cityLookup) {
    let option = document.createElement("option");
    option.value = cityLookup[key];
    option.text = key;
    selectList.add(option);
}

//assiging a lat/long to each city so it can be used in the api query
let buttonSelectHandler = function(event) {

    city = event.target.value;

    // clear the result grids before populating with new data
    resultGridAll.innerHTML = '';

}


//adding new code here so if it blows up delete this part
let buttonClickHandler = function (event) {
    var clickedButton = event.target.getAttribute("id");
    console.log(clickedButton);
    console.log(city);
    if (clickedButton === "btn-hotel") {
        resultGridAll.innerHTML = '';
        getHotel(city);
    } else if (clickedButton === "btn-food") {
        resultGridAll.innerHTML = '';
        getFood(city);
    } else if (clickedButton === "btn-activity") {
        resultGridAll.innerHTML = '';
        getActivity(city);
    } 
};



let getActivity = function(city) {
    let queryURL ="https://places.ls.hereapi.com/places/v1/discover/explore?&at=" + city + "&cat=sights-museums&apiKey=" + APIKey;

    fetch(queryURL)
    .then(function(response) {
        if(response.ok) {
            console.log("Activity response", response);
            response.json().then(function(data) {
                console.log("Activity data", data);

                //setting loop to give back the top 10 attractions
                for(let i=0; i<10; i++){
                    console.log("Title: ", data.results.items[i].title);
                
				//adding details from API as text to HTML
                let activityInfo = `
                <div class = "activity-info">
                    <img class="activity-icon" src="${data.results.items[i].icon}" alt="activity-icon"></img>
                    <ul class = "activity-misc-info">
                        <li class = "title"><b>Name:</b> ${data.results.items[i].title}</li>
                        <li class = "type"><b>Type:</b> ${data.results.items[i].category.title}</li>
                        <li class = "address"><b>Address:</b> ${data.results.items[i].vicinity}</li>
                    </ul>
                </div>
            `;
            // add an event listener to the activity-info element
            let activityElement = document.createElement('div');
            activityElement.innerHTML = foodInfo;
            activityElement.addEventListener('click', function(event) {
                event.preventDefault();
                let activityName = data.results.items[i].title;
                let activityType = data.results.items[i].category.title;
                let activityAddress = data.results.items[i].vicinity;

            // send the data to the server using a POST request
            fetch('/activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify({
                        name: activityName,
                        type: activityType,
                        address: activityAddress,
                    })
                }).then(response => {
                    console.log('Activity saved to server!');
                }).catch(error => {
                    console.error('Error saving activity:', error);
                });
            });

            resultGridAll.innerHTML += activityInfo;
        }
    });
} else {
    console.log('Error: ' + response.statusText);
}
});
};

//Function to get restaurant locations in selected city
let getFood = function(city) {
    let queryURL ="https://places.ls.hereapi.com/places/v1/discover/explore?at=" + city + "&cat=restaurant&apiKey=" + APIKey;

    fetch(queryURL)
    .then(function(response) {
        if(response.ok) {
            console.log("Food response", response);
            response.json().then(function(data) {
                console.log("Food data", data);

                //setting loop to give back the top 10 places to eat
                for(let i=0; i<10; i++){

				//adding details from API as text to HTML
                let foodInfo = `
                <div class = "food-info">
                    <img class="food-icon" src="${data.results.items[i].icon}" alt="food-icon"></img>
                    <ul class = "food-misc-info">
                        <li class = "title"><b>Restaurant Name:</b> ${data.results.items[i].title}</li>
                        <li class = "address"><b>Address:</b> ${data.results.items[i].vicinity}</li>
                        <li class = "hours"><b>Hours:</b> ${data.results.items[i].openingHours.text}</li>
                    </ul>
                </div>
            `;
            // add an event listener to the food-info element
            let foodElement = document.createElement('div');
            foodElement.innerHTML = foodInfo;
            foodElement.addEventListener('click', function(event) {
                event.preventDefault();
                let foodName = data.results.items[i].title;
                let foodAddress = data.results.items[i].vicinity;
                let foodHours = data.results.items[i].openingHours.text;

            // send the data to the server using a POST request
            fetch('/food', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify({
                        name: foodName,
                        address: foodAddress,
                        hours: foodHours,
                    })
                }).then(response => {
                    console.log('Food saved to server!');
                }).catch(error => {
                    console.error('Error saving food:', error);
                });
            });
            resultGridAll.innerHTML += foodInfo;
        }
    });
} else {
    console.log('Error: ' + response.statusText);
}
});
};

//function to find the hotels in the selected city
let getHotel = function(city) {
    let queryURL ="https://places.ls.hereapi.com/places/v1/discover/explore?at=" + city + "&cat=accommodation&apiKey=" + APIKey;

    fetch(queryURL)
    .then(function(response) {
        if(response.ok) {
            console.log("Hotel response", response);
            response.json().then(function(data) {
                console.log("Hotel data", data);

                //setting loop to give back the top 10 accomodations
                for(let i=0; i<10; i++){

				    //adding details from API as text to HTML
                    let hotelInfo = `
                    <div class = "hotel-info">
                        <img class="hotel-icon" src="${data.results.items[i].icon}" alt="hotel-icon"></img>
                        <ul class = "hotel-misc-info">
                            <li class = "title"><b>Hotel Name:</b> ${data.results.items[i].title}</li>
                            <li class = "type"><b>Type:</b> ${data.results.items[i].category.title}</li>
                            <li class = "address"><b>Address:</b> ${data.results.items[i].vicinity}</li>
                        </ul>
                    </div>
                `;

                // add an event listener to the hotel-info element
                let hotelElement = document.createElement('div');
                    hotelElement.innerHTML = hotelInfo;
                    hotelElement.addEventListener('click', function(event) {
                        event.preventDefault();
                        let hotelName = data.results.items[i].title;
                        let hotelType = data.results.items[i].category.title;
                        let hotelAddress = data.results.items[i].vicinity;

                    // send the data to the server using a POST request
                    fetch('/hotel', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                            body: JSON.stringify({
                                name: hotelName,
                                type: hotelType,
                                address: hotelAddress,
                            })
                        }).then(response => {
                            console.log('Hotel saved to server!');
                        }).catch(error => {
                            console.error('Error saving hotel:', error);
                        });
                    });

                resultGridAll.innerHTML += hotelInfo;
            }
        });
    } else {
        console.log('Error: ' + response.statusText);
    }
    });
    };

//event listeners
selectValue.addEventListener("change", buttonSelectHandler);
// buttonsEl.addEventListener("click", buttonClickHandler);
btnHotel.addEventListener("click", buttonClickHandler);
btnFood.addEventListener("click", buttonClickHandler);
btnActivity.addEventListener("click", buttonClickHandler);