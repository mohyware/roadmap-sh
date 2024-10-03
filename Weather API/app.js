const express = require("express");
const app = express();
require('dotenv').config();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// routers
const weatherRouter = require("./routes/weather-route");

// middleware
const cacheData = require("./middleware/cacheData");
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get('/api/v1/weatherAPI/', (req, res) => { res.send('Hello') })
app.use('/api/v1/weatherAPI/:city/:startDate?/:endDate?/:time?', cacheData, weatherRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

