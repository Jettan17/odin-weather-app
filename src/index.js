import "./style.css";

async function getWeatherData(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=Q9VPWA64VU6LM9FM36Y3ZAXJW&contentType=json`);
    
    const jsonData = await response.json()
    
    return processWeatherData(jsonData);
}

function processWeatherData(jsonData) {
    const finalWeatherData = { //Only process relevant attributes
        address: jsonData.address,
        description: jsonData.description,
        currentConditions: {
            conditions: jsonData.currentConditions.conditions,
            datetime: new Date().toISOString().slice(0, 10),
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
    }

    return finalWeatherData;
}

console.log(getWeatherData("Singapore"));
console.log(getWeatherData("Malaysia"));
console.log(getWeatherData("France"));