const express = require('express');
const router = express.Router();
const Court = require('../models/Court');

router.get('/', async (req,res) => {
  const courts = await Court.find();
  res.json(courts);
});

router.post('/', async (req,res) => {
  try {
    const c = new Court(req.body);
    await c.save();
    res.json({ message: 'Court added', court: c });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
