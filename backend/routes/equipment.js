const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

router.get('/', async (req, res) => {
  const eq = await Equipment.find();
  res.json(eq);
});
router.post('/', async (req, res) => {
  try {
    const e = new Equipment(req.body);
    await e.save();
    res.json({ message: 'Equipment added', equipment: e });
  } catch (err) { res.status(400).json({ message: err.message }); }
});
module.exports = router;
