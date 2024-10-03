const redisClient = require("../config/redis-config");
const { BadRequestError } = require('../errors')

const cacheData = async (req, res, next) => {
    const { city, startDate = '', endDate = '2024-9-24', time = '13:00:00' } = req.params;
    const key = `${city}:${startDate}:${endDate}T${time}`;

    if (!city) {
        throw new BadRequestError('City is required')
    }

    let results;
    try {
        const cacheResults = await redisClient.get(key);
        if (cacheResults) {
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results,
            });
        } else {
            res.locals.city = city;
            res.locals.startDate = startDate;
            res.locals.endDate = endDate;
            res.locals.time = time;


            next();
        }
    } catch (error) {
        console.error(error);
        res.status(404);
    }
}

module.exports = cacheData
