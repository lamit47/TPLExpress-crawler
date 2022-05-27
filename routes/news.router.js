const express = require('express');
const { getNews, getNewsById } = require('../controllers/news.js');

const router = express.Router();

router
  .route("/:id")
  .get(getNewsById);
  
router.route("/").get(getNews);

module.exports = router;
