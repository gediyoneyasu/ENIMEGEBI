const express = require('express');
const router = express.Router();
const { saveContact } = require('../controllers/contactController');

router.post('/', saveContact);

module.exports = router;