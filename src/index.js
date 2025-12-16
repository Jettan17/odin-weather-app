import "./style.css";

async function getWeatherData(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=Q9VPWA64VU6LM9FM36Y3ZAXJW&contentType=json`);
    
    console.log(response.status);
    if (response.status.toString()[0] === "2") {
        const jsonData = await response.json();
    
        return processWeatherData(jsonData);
    } else {
        return null;
    }
};

function processWeatherData(jsonData) {
    const finalWeatherData = { //Only process relevant attributes
        address: jsonData.address,
        description: jsonData.description,
        currentConditions: {
            conditions: jsonData.currentConditions.conditions,
            feelslike: jsonData.currentConditions.feelslike,
            humidity: jsonData.currentConditions.humidity,
            icon: jsonData.currentConditions.icon,
            temp: jsonData.currentConditions.temp
        },
        dayConditions: [...jsonData.days.slice(0, 7).map(day => ({
            datetime: day.datetime,
            humidity: day.humidity,
            icon: day.icon,
            temp: day.temp
        }))]
    };

    return finalWeatherData;
};

document.addEventListener("DOMContentLoaded", () => {
    //Handle form input
    const form = document.getElementById("location-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const dataObject = Object.fromEntries(formData.entries()); //converts to object

        console.log(dataObject["location-input"]);
        const weatherData = await getWeatherData(dataObject["location-input"]);
        console.log(weatherData);

        //Load weatherData into display
        const locationName = document.getElementById("location-name");
        locationName.textContent = weatherData.address;

        const locationDescription = document.getElementById("location-description");
        locationDescription.textContent = weatherData.description;

        // const weatherIconNames = { //update with actual filenames
        //     "Partially cloudy": "cloud",
        //     "Sunny": "sun"
        // };

        // const currentIcon = document.querySelector("#current-day-display .weather-icon");
        // currentIcon.src = `./${weatherIconNames[`${weatherData.currentConditions.icon}`]}`;
        
        for (const [key, value] of Object.entries(weatherData.currentConditions)) {
            if (key === "icon") {
                continue;
            }
            const currentAttribute = document.querySelector(`#current-day-display .${key}`);
            currentAttribute.textContent = value;
        }

        const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let counter = 0;
        for (const dayContainer of document.getElementById("week-display").children) {
            const dayData = weatherData.dayConditions[counter];

            const dayName = dayContainer.querySelector(".day-name");
            dayName.textContent = dayList[(new Date(dayData.datetime)).getDay()];

            // const weatherIcon = dayContainer.querySelector(".weather-icon");
            // weatherIcon.src = `./${weatherIconNames[`${dayData.icon}`]}`;

            const tempVal = dayContainer.querySelector(".temp");
            tempVal.textContent = dayData.temp;

            const humidityVal = dayContainer.querySelector(".humidity");
            humidityVal.textContent = dayData.humidity;

            counter++;
        }

        const locationInfoDisplay = document.getElementById("location-info-display");
        locationInfoDisplay.style.display = "block";
    });

    //Generate week display
    const weekDisplay = document.getElementById("week-display");
    for (let i = 0; i < 7; i++) {
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");

        const dayName = document.createElement("p");
        dayName.classList.add("day-name");
        const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        dayName.textContent = dayList[i];
        dayContainer.appendChild(dayName);

        const weatherIcon = document.createElement("img");
        weatherIcon.classList.add("weather-icon");
        weatherIcon.src = "";
        weatherIcon.alt = "weather icon";
        dayContainer.appendChild(weatherIcon);
        
        const temperatureIcon = document.createElement("img");
        temperatureIcon.src = "";
        temperatureIcon.alt = "temperature";
        dayContainer.appendChild(temperatureIcon);

        const tempValue = document.createElement("p");
        tempValue.classList.add("temp");
        tempValue.textContent = "";
        dayContainer.appendChild(tempValue);

        const humidityIcon = document.createElement("img");
        humidityIcon.src = "";
        humidityIcon.alt = "humidity";
        dayContainer.appendChild(humidityIcon);

        const humidityValue = document.createElement("p");
        humidityValue.classList.add("humidity");
        humidityValue.textContent = "";
        dayContainer.appendChild(humidityValue);

        weekDisplay.appendChild(dayContainer);
    };

    //Hide location info display intially
    const locationInfoDisplay = document.getElementById("location-info-display");
    locationInfoDisplay.style.display = "none";
});