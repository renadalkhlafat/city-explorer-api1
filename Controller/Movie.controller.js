const axios = require('axios');
const Movies = require('../Modale/Movies');
const Cache = require('../Modale/Cache')

let cacheObj = new Cache();
function moviesHandler(req, res) {

    const moviesKey = process.env.MOVIES_API_KEY;
    const key = `movies-${req.params.query}`;
    let url = `https://api.themoviedb.org/3/search/multi?api_key=${moviesKey}&query=${req.params.query}`;
    console.log(req.params.query)
    let moviesArr = [];
    if (req.params.query) {

        if (cacheObj[key] && Date.now() - cacheObj[key].timeStamp < 86400000) {
            console.log('Mfound');
            // console.log(cacheObj[key].timeStamp);
            // console.log(Date.now());
            res.send(cacheObj[key].data)
        } else {
            console.log('M not found');
            axios
                .get(url)
                .then((moviesData) => {
                    moviesData.data.results.map((item) => {
                        if (item.poster_path) {
                            if (item.release_date !== 'Invalid Date') {
                                moviesArr.push(new Movies(item))
                            }
                        }
                    });
                    cacheObj[key] = {};
                    cacheObj[key].timeStamp = Date.now();
                    cacheObj[key].data = moviesArr
                    
                    res.send(moviesArr);
                })
                .catch((error) => {
                    res.status(500).send(error);
                });
        }
    } else {
        res.send("please provide the city name");
    }
}
module.exports = moviesHandler;