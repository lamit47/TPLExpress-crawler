const bodyParser = require('body-parser');
const cors = require('cors');;
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { getRSSData, autoGetData } = require('./utils/vnexpress');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon');
const path = require('path');

const newsRouter = require('./routes/news.router.js');

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;
const app = express();

app.use(express.static('./public'));
app.use(expressLayouts);
app.set('layout', 'default');
app.set('view engine', 'ejs');
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

app.use(favicon(path.join(__dirname, 'public','imgs','favicon.ico')));

//Routes
app.use('/', require('./routes/home.router'));
app.use('/api/news' , newsRouter);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  // Running a job at 01:00 everyday
  cron.schedule('00 01 * * *', () => {
    getRSSData('https://vnexpress.net/rss/thoi-su.rss');
    console.log('getRssData Succesfully...');
  });
  
  // Running a task every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    // console.log('Fetching data....');
    autoGetData(5);
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}).catch((err) => {
  console.log('err', err);
});