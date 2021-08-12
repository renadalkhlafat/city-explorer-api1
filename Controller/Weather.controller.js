const axios = require('axios')
const Forecast = require('../Modale/Forecast');
const Cache = require('../Modale/Cache')
let cacheObj = new Cache();

function handleWeather(req, res) {
    const key = `weather-${req.params.lat}-${req.params.lon}`
    const weatherKey = process.env.WEATHER_API_KEY;
    const resUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${+req.params.lat}&lon=${+req.params.lon}&key=${weatherKey}`;
    let weatherArr = [];
    if (req.params.lat && req.params.lon) {

        if (cacheObj[key] && Date.now() - cacheObj[key].timeStamp < 86400000) {
            console.log('found');
            // console.log(cacheObj[key].data);
            res.json(cacheObj[key].data)

        } else {

            axios
                .get(resUrl)
                .then((weather) => {
                    weather.data.data.map((day) => {
                        weatherArr.push(new Forecast(day));
                    });
                    cacheObj[key] = {};
                    cacheObj[key].timeStamp = Date.now();
                    cacheObj[key].data = weatherArr

                    res.send(weatherArr);
                })
                .catch((error) => {
                    res.status(500).send(error);
                });
        }
    } else {
        res.send("please provide the proper lat and lon");
    }

}

module.exports = handleWeather;