//*** Dependencies ***//
//====================//
const express = require('express');
const path = require('path');

//*** Directories ***//
//===================//
const VIEWS_DIR = path.resolve(__dirname, '../public/views')

//*** Express Router ***//
//======================//
const router = express.Router();

//*** HTML Routes ***//
//===================//

//Root route to index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, 'index.html'));
});

module.exports = router;