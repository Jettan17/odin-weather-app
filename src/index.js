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
            datetime: new Date().toISOString().slice(0, 10), //currentDay in YYYY MM DD format
            feelslike: jsonData.currentConditions.feelslike,
            humidity: jsonData.currentConditions.humidity,
            icon: jsonData.currentConditions.icon,
            temp: jsonData.currentConditions.temp
        },
        dayConditions: [...jsonData.days.map(day => ({
            conditions: day.conditions,
            datetime: day.datetime,
            feelslike: day.feelslike,
            humidity: day.humidity,
            icon: day.icon,
            temp: day.temp
        }))]
    };

    return finalWeatherData;
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("location-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const dataObject = Object.fromEntries(formData.entries()); //converts to object

        console.log(dataObject["location-input"]);
        const weatherData = getWeatherData(dataObject["location-input"]);
        console.log(weatherData);
    });
});