const redisClient = require("../config/redis-config");
const fetchApiData = require("../services/weather-service");


const getCityWeather = async (req, res) => {
    city = res.locals.city;
    startDate = res.locals.startDate;
    endDate = res.locals.endDate;
    time = res.locals.time;
    const key = `${city}:${startDate}:${endDate}T${time}`;

    let results;

    try {
        results = await fetchApiData(city, startDate, endDate, time);
        if (results.length === 0) {
            throw "API returned an empty array";
        }
        await redisClient.set(key, JSON.stringify(results), {
            EX: 20,
            NX: true,
        });

        res.send({
            fromCache: false,
            data: results,
        });
    } catch (error) {
        console.error(error);
        res.status(404).send("Data unavailable");
    }
}


module.exports = {
    getCityWeather
}