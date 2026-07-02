const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require('mongoose');
const { runSeeders } = require('../database/seeders');

/**
 * Connect to MongoDB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Run seeders after successful connection
    if (process.env.NODE_ENV !== 'production' || process.env.RUN_SEEDERS === 'true') {
      await runSeeders();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
