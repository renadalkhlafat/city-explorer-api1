const axios = require('axios')
const Forecast =require('../Modale/Forecast');

function handleWeather(req, res) {
    const weatherKey = process.env.WEATHER_API_KEY;
    const resUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${+req.params.lat}&lon=${+req.params.lon}&key=${weatherKey}`;
    let weatherArr = [];
    axios
        .get(resUrl)
        .then((weather) => {
            weather.data.data.map((day) => {
                weatherArr.push(new Forecast(day));
            });
            res.send(weatherArr);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}

module.exports=handleWeather;