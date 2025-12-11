const express = require('express');
const router = express.Router();
const PricingRule = require('../models/PricingRule');

router.get('/', async (req,res)=> {
  const rules = await PricingRule.find();
  res.json(rules);
});
router.post('/', async (req,res)=> {
  try {
    const r = new PricingRule(req.body);
    await r.save();
    res.json({ message: 'Rule added', rule: r });
  } catch (err) { res.status(400).json({ message: err.message }); }
});
module.exports = router;
