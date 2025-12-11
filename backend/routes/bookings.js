const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');

// helper: find overlapping bookings
function overlap(aStart, aEnd, bStart, bEnd) {
  return (aStart < bEnd) && (bStart < aEnd);
}

// Core price calculator (same logic reused in /calc and POST /)
async function calculatePrice({ courtId, startTime, endTime, equipmentItems, coachId }) {
  const s = new Date(startTime);
  const e = new Date(endTime);
  const court = await Court.findById(courtId);
  const rules = await PricingRule.find({ active: true });

  let base = (court && court.basePrice) ? court.basePrice : 0;
  // compute duration in hours (fractional)
  const hours = Math.max(1, (e - s) / 1000 / 60 / 60);

  let price = base * hours;
  const breakdown = { basePricePerHour: base, hours, baseTotal: base * hours };

  const bookingHour = s.getHours();
  const bookingDay = s.getDay();

  for (let r of rules) {
    if (r.days && r.days.length && !r.days.includes(bookingDay)) continue;
    if (typeof r.startHour === 'number' && typeof r.endHour === 'number') {
      if (!(bookingHour >= r.startHour && bookingHour < r.endHour)) continue;
    }
    if (r.multiplier && r.multiplier !== 1) {
      const delta = price * (r.multiplier - 1);
      breakdown[r.name] = (breakdown[r.name] || 0) + delta;
      price = price * r.multiplier;
    } else if (r.surcharge) {
      breakdown[r.name] = (breakdown[r.name] || 0) + r.surcharge;
      price += r.surcharge;
    }
  }

  // equipment fees
  let equipmentFee = 0;
  if (equipmentItems && equipmentItems.length) {
    for (let it of equipmentItems) {
      const eq = await Equipment.findById(it.equipment);
      if (!eq) continue;
      equipmentFee += (eq.pricePerUnit || 0) * (it.qty || 0);
    }
  }
  breakdown.equipmentFee = equipmentFee;
  price += equipmentFee;

  // coach fees
  let coachFee = 0;
  if (coachId) {
    const coach = await Coach.findById(coachId);
    coachFee = (coach && coach.hourlyRate ? coach.hourlyRate : 0) * hours;
    breakdown.coachFee = coachFee;
    price += coachFee;
  }

  breakdown.total = price;
  return { price, breakdown };
}

// POST /api/bookings/calc  -> preview price (no DB write)
router.post('/calc', async (req, res) => {
  try {
    const { courtId, startTime, endTime, equipmentItems, coachId } = req.body;
    const result = await calculatePrice({ courtId, startTime, endTime, equipmentItems, coachId });
    return res.json({ success: true, pricingBreakdown: result.breakdown, total: result.price });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// POST /api/bookings  -> create booking after availability checks
router.post('/', async (req, res) => {
  try {
    const { userName, courtId, coachId, equipmentItems, startTime, endTime } = req.body;
    if (!userName) return res.status(400).json({ message: 'userName required' });

    const s = new Date(startTime);
    const e = new Date(endTime);

    // 1) court conflict
    const courtConflicts = await Booking.find({
      court: courtId,
      status: 'confirmed',
      $or: [
        { startTime: { $lt: e, $gte: s } },
        { endTime: { $gt: s, $lte: e } },
        { startTime: { $lte: s }, endTime: { $gte: e } }
      ]
    });
    if (courtConflicts && courtConflicts.length) return res.status(400).json({ message: 'Court not available' });

    // 2) coach conflict
    if (coachId) {
      const coachConflicts = await Booking.find({
        coach: coachId,
        status: 'confirmed',
        $or: [
          { startTime: { $lt: e, $gte: s } },
          { endTime: { $gt: s, $lte: e } },
          { startTime: { $lte: s }, endTime: { $gte: e } }
        ]
      });
      if (coachConflicts && coachConflicts.length) return res.status(400).json({ message: 'Coach not available' });
    }

    // 3) equipment availability
    if (equipmentItems && equipmentItems.length) {
      // find all overlapping bookings and count items
      const overlapping = await Booking.find({
        status: 'confirmed',
        $or: [
          { startTime: { $lt: e, $gte: s } },
          { endTime: { $gt: s, $lte: e } },
          { startTime: { $lte: s }, endTime: { $gte: e } }
        ]
      });

      for (let item of equipmentItems) {
        const eq = await Equipment.findById(item.equipment);
        if (!eq) return res.status(400).json({ message: 'Equipment not found' });

        let qtyBooked = 0;
        for (let b of overlapping) {
          for (let it of (b.equipment || [])) {
            if (it.equipment.toString() === item.equipment) qtyBooked += (it.qty || 0);
          }
        }
        if ((qtyBooked + (item.qty || 0)) > eq.totalStock) {
          return res.status(400).json({ message: `Not enough ${eq.name} available` });
        }
      }
    }

    // 4) calculate price
    const { price, breakdown } = await calculatePrice({ courtId, startTime, endTime, equipmentItems, coachId });

    // 5) create booking
    const b = new Booking({
      userName,
      court: courtId,
      coach: coachId || null,
      equipment: equipmentItems || [],
      startTime: s,
      endTime: e,
      pricingBreakdown: breakdown
    });
    await b.save();
    return res.json({ message: 'Booked', booking: b });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET list bookings
router.get('/', async (req,res) => {
  const list = await Booking.find().populate('court coach equipment.equipment');
  res.json(list);
});

module.exports = router;
