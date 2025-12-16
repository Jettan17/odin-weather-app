import "./style.css";
import tempIcon from "./assets/temp.svg";
import humidityIcon from "./assets/humidity.svg";

// Dynamically import all weather icons
const iconContext = require.context('./assets/weather-icons/', false, /\.svg$/);
const iconMap = {};
iconContext.keys().forEach(key => {
    const iconName = key.replace('./', '').replace('.svg', '');
    iconMap[iconName] = iconContext(key);
});

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

        const validationLabel = document.getElementById("validation-label");

        if (weatherData === null) {
            validationLabel.style.visibility = "visible";
            return;
        } else {
            validationLabel.style.visibility = "hidden";
        }

        //Load weatherData into display
        const locationName = document.getElementById("location-name");
        locationName.textContent = weatherData.address;

        const locationDescription = document.getElementById("location-description");
        locationDescription.textContent = weatherData.description;

        const currentIcon = document.querySelector("#current-day-display .weather-icon");
        currentIcon.src = iconMap[weatherData.currentConditions.icon];
        
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

            const weatherIcon = dayContainer.querySelector(".weather-icon");
            weatherIcon.src = iconMap[dayData.icon];

            const tempVal = dayContainer.querySelector(".temp");
            tempVal.textContent = dayData.temp;

            const humidityVal = dayContainer.querySelector(".humidity");
            humidityVal.textContent = dayData.humidity;

            counter++;
        }

        const locationInfoDisplay = document.getElementById("location-info-display");
        locationInfoDisplay.style.visibility = "visible";
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
        temperatureIcon.src = tempIcon;
        temperatureIcon.alt = "temperature";
        dayContainer.appendChild(temperatureIcon);

        const tempValue = document.createElement("p");
        tempValue.classList.add("temp");
        tempValue.textContent = "";
        dayContainer.appendChild(tempValue);

        const humidityImg = document.createElement("img");
        humidityImg.src = humidityIcon;
        humidityImg.alt = "humidity";
        dayContainer.appendChild(humidityImg);

        const humidityValue = document.createElement("p");
        humidityValue.classList.add("humidity");
        humidityValue.textContent = "";
        dayContainer.appendChild(humidityValue);

        weekDisplay.appendChild(dayContainer);
    };

    //Hide location info display intially
    const locationInfoDisplay = document.getElementById("location-info-display");
    locationInfoDisplay.style.visibility = "hidden";

    //Hide validation label
    const validationLabel = document.getElementById("validation-label");
    validationLabel.style.visibility = "hidden";
});