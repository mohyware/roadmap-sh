const express = require('express')
const { getCityWeather } = require('../controllers/weather-controller')

const router = express.Router()

router.get('/', getCityWeather)

module.exports = router;
