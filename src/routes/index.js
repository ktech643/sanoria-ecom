const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.render('home', {
    title: 'Home',
  });
});

module.exports = router;