const express = require('express');
const customerController = require('../controllers/customer.controller');

const router = express.Router();

router.get('/' , customerController.viewLastAddedMovies)

module.exports = router;