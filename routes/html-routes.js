//*** Dependencies ***//
//====================//
const router = require('express').Router();
const path = require('path');

//*** Directories ***//
//===================//
const VIEWS_DIR = path.resolve(__dirname, '../public/views')

//*** HTML Routes ***//
//===================//
//Root route to index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, 'index.html'));
});

module.exports = router;