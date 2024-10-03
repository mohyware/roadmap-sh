const dotenv = require('dotenv');
const redis = require('redis');

dotenv.config(); // Load environment variables from .env file

//redis setup
let redisClient;

(async () => {
    redisClient = redis.createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    });

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

module.exports = redisClient;