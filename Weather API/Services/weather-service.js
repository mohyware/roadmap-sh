const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

// fetch data from the api
async function fetchApiData(city, startDate = '', endDate = '', time = '') {
    const apiResponse = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${startDate}/${endDate}T${time}?key=${process.env.API_KEY}&include=current`
    );
    console.log("Request sent to the API");

    console.log(`${city}/${startDate}/${endDate}/T${time}`);
    return apiResponse.data;
}

module.exports = fetchApiData
