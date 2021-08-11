const axios = require('axios');
const Movies = require('../Modale/Movies');

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
module.exports = moviesHandler;