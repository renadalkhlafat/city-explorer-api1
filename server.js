'use strict';
require('dotenv').config();
const express = require('express');
const axios = require('axios')
const cors = require('cors');
const weatherjson = require('./data/weather.json');
const server = express();
server.use(cors());

const PORT = process.env.PORT;

server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server is running on port  ${PORT}`);
});

server.get('/weather', (req, res) => {
    res.send(weatherjson)
})

server.get('/weather/:lon/:lat/:city_name', (req, res) => {
    const data = weatherjson.find(
        (ele) =>
            +ele.lon === +req.params.lon &&
            +ele.lat === +req.params.lat &&
            ele.city_name === req.params.city_name
    );
    data
        ?
        res.send(data) :
        res.status(404).send('the location with given lon was not found');
});

server.get('/weather/:city_name', (req, res) => {
    let weatherArr = [];

    const resData = weatherjson.find((ele) => ele.city_name === req.params.city_name);

    if (resData) {
        resData.data.map((day) => {
            weatherArr.push(new Forecast(day));
        });
        res.send(weatherArr);
    } else {
        res.status(500).send('the location  was not found');
    }
});

server.get('/weather/:lon/:lat', handleWeather);
server.get('/movies/:query', moviesHandler);

function handleWeather(req, res) {
    const weatherKey = process.env.WEATHER_API_KEY;
    const resUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${+req
        .params.lat}&lon=${+req.params.lon}&key=${weatherKey}`;
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

function moviesHandler(req, res) {

    const moviesKey = process.env.MOVIES_API_KEY;

    let url = `https://api.themoviedb.org/3/search/multi?api_key=${moviesKey}&query=${req.params.query}`;
    console.log(req.params.query)
    let moviesArr = [];
    axios
        .get(url)
        .then((moviesData) => {
            console.log(moviesData.data.results)
            moviesData.data.results.map((item) => {
                if (item.poster_path && (+item.vote_count >= 1)) {
                    moviesArr.push(new Movies(item))
                }
            });
            res.send(moviesArr);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}

class Movies {
    constructor(movie) {
        (this.released_on = movie.release_date),
            (this.title = movie.title),
            (this.total_votes = movie.vote_count),
            (this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`),
            (this.average_votes = movie.vote_average),
            (this.overview = movie.overview),
            (this.popularity = movie.popularity)
    }
}

class Forecast {
    constructor(city) {
        this.date = city.datetime;
        this.description = `Low of ${city.low_temp} and high of ${city.max_temp}with ${city.weather.description}`;
        this.temp = city.temp;
    }
};