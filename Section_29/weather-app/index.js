const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set view engine
app.set('view engine', 'ejs');

// Static folder for CSS
app.use(express.static('public'));

// API Key from OpenWeatherMap
const apiKey = '07c43a689a392c5107106f35aaa593df';

// Home route
app.get('/', async (req, res) => {
    try {
        // Get location from query (default to London)
        const location = req.query.location || 'London';
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`);
        const weatherData = response.data;

        // Check if it will rain tomorrow
        const tomorrowWeather = weatherData.list[1]; // Tomorrow's forecast (next 3-hour block)
        const willRain = tomorrowWeather.weather.some(weather => weather.main.toLowerCase() === 'rain');

        res.render('index', {
            location: location,
            willRain: willRain,
            temperature: tomorrowWeather.main.temp,
            description: tomorrowWeather.weather[0].description
        });
    } catch (error) {
        console.error(error);
        res.send("Error occurred while fetching weather data.");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
