const express = require("express");
require('dotenv').config();
const fileRoutes = require('./routes/upload-route.js');
const { connectDB } = require('./db/connect.js');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const app = express();
const port = process.env.PORT || 4000;

// frontend
app.use(express.static('./views'));
app.use(express.json())

// routes
app.use('/api/v1/md/', fileRoutes);

// handling errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();