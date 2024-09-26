const mongoose = require('mongoose')

let bucket;

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URI, {
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      reject(err);
    });

    mongoose.connection.once('open', () => {
      console.log('MongoDB connection established successfully');
      bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
      console.log('GridFSBucket initialized');
      resolve(); // Resolve the promise when the bucket is initialized
    });
  });
};

const getBucket = () => {
  if (!bucket) {
    throw new Error('GridFSBucket is not initialized yet.');
  }
  return bucket;
};


module.exports = { connectDB, getBucket };
