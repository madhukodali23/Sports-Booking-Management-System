const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');

router.get('/', async (req, res) => {
  const coaches = await Coach.find();
  res.json(coaches);
});
router.post('/', async (req, res) => {
  try {
    const c = new Coach(req.body);
    await c.save();
    res.json({ message: 'Coach added', coach: c });
  } catch (err) { res.status(400).json({ message: err.message }); }
});
module.exports = router;
