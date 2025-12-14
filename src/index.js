import "./style.css";

async function getWeatherData(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup = metric&key=Q9VPWA64VU6LM9FM36Y3ZAXJW&contentType=json`);
    
    const jsonData = await response.json()

    console.log(jsonData)
}

getWeatherData("Singapore");
getWeatherData("Malaysia");
getWeatherData("France");