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
module.exports=Movies;