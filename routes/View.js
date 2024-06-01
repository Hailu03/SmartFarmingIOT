const express = require('express');
const router = express.Router();

// Route to render the index view
router.get('/', function (req, res) {
    res.render('index');
});

module.exports = router;