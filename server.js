'use strict';
require('dotenv').config();
const express = require('express');
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

class Forecast {
    constructor(city) {
        this.date = city.datetime;
        this.description = city.weather.description
    }
};