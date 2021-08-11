class Forecast {
    constructor(city) {
        this.date = city.datetime;
        this.description = `Low of ${city.low_temp} and high of ${city.max_temp}with ${city.weather.description}`;
        this.temp = city.temp;
    }
};

module.exports=Forecast;