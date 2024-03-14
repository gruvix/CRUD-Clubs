const express = require('express');

const router = express.Router();

router.get('', (req, res) => {
  let message = 'Bad Request';
  if (req.query.keyword) {
    message = req.query.keyword.replaceAll('-', ' ');
  }
  let code = 400;
  if (req.query.code) {
    code = req.query.code;
  }
  res.render('error', {
    layout: 'main',
    data: {
      message,
      code,
    },
  });
});

module.exports = router;
