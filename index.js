const bodyParser = require('body-parser');
const cors = require('cors');;
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { getRSSData, autoGetData } = require('./utils/vnexpress');
require('dotenv').config()

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;
const app = express()

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  // Running a job at 01:00 everyday
  cron.schedule('0 1 * * *', () => {
    getRSSData('https://vnexpress.net/rss/the-gioi.rss');
  });
  // Running a task every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    console.log('Fetching data....');
    autoGetData(5);
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}).catch((err) => {
  console.log('err', err);
});