const express = require('express');
const { homeView, detailView } = require('../controllers/home.controller');
const router = express.Router();

router.get('/', homeView);
router.get('/detail/:id', detailView);

module.exports = router;
