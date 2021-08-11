'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());

const PORT = process.env.PORT;

const handleWeather =require('./Controller/Weather.controller');
const moviesHandler = require('./Controller/Movie.controller');

server.get('/weather/:lon/:lat', handleWeather);
server.get('/movies/:query', moviesHandler);

server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server is running on port  ${PORT}`);
});
