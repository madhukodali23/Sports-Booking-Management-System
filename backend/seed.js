require('dotenv').config();
const mongoose = require('mongoose');
const Court = require('./models/Court');
const Coach = require('./models/Coach');
const Equipment = require('./models/Equipment');
const PricingRule = require('./models/PricingRule');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acorn-globus';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('connected');

  await Court.deleteMany({});
  await Coach.deleteMany({});
  await Equipment.deleteMany({});
  await PricingRule.deleteMany({});

  const courts = await Court.insertMany([
    { name: 'Court A', type: 'indoor', basePrice: 200 },
    { name: 'Court B', type: 'indoor', basePrice: 150 }
  ]);
  const coaches = await Coach.insertMany([
    { name: 'John', hourlyRate: 300 },
    { name: 'Priya', hourlyRate: 250 }
  ]);
  const equipment = await Equipment.insertMany([
    { name: 'Racket', totalStock: 10, pricePerUnit: 50 },
    { name: 'Shoes', totalStock: 8, pricePerUnit: 40 }
  ]);
  const rules = await PricingRule.insertMany([
    { name: 'Evening Peak', type: 'peak', startHour: 18, endHour: 21, multiplier: 1.5, active: true },
    { name: 'Weekend Surcharge', type: 'weekend', days: [0,6], surcharge: 50, active: true },
    { name: 'Indoor Premium', type: 'premium', multiplier: 1.1, active: true }
  ]);

  console.log('seeded');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
