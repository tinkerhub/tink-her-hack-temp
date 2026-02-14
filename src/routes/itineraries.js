const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const { getDb } = require('../db');
const auth = require('../middleware/auth');

const createSchema = Joi.object({
  destination: Joi.string().required(),
  days: Joi.number().integer().min(1).max(30).required(),
  priorities: Joi.array().items(Joi.string()).length(3).required()
});

// Helper: generate city data (port from frontend)
function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

function getOrGenerateCityData(city) {
  const cityKey = city.toLowerCase().trim();
  const known = {
    kochi: {
      "Food Spots": ["B for Biriyani", "Pai Dosa", "Kashi Art Cafe", "Grand Pavilion", "Paragon Restaurant", "Dhe Puttu"],
      "Tourist Spots": ["Fort Kochi Beach", "Chinese Fishing Nets", "Mattancherry Palace", "Jewish Synagogue", "Marine Drive", "Hill Palace"],
      "Shopping": ["Lulu Mall", "Jew Town", "Broadway Market", "Centre Square Mall", "Oberon Mall"],
      "image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=3840&auto=format&fit=crop"
    }
  };
  if (known[cityKey]) return known[cityKey];
  const formattedCity = capitalizeWords(city);
  return {
    "Food Spots": [
      `The ${formattedCity} Bistro`,
      `${formattedCity} Spice Kitchen`,
      `Royal ${formattedCity} Grill`,
      `Taste of ${formattedCity} Central`,
      `The Golden Spoon ${formattedCity}`,
      `${formattedCity} Street Food Hub`
    ],
    "Tourist Spots": [
      `${formattedCity} National Museum`,
      `Historic Old Town of ${formattedCity}`,
      `${formattedCity} City Park`,
      `The Grand ${formattedCity} Monument`,
      `${formattedCity} Botanical Gardens`,
      `Sunset Viewpoint at ${formattedCity}`
    ],
    "Shopping": [
      `${formattedCity} Central Market`,
      `The Grand ${formattedCity} Mall`,
      `${formattedCity} Artisan Bazaar`,
      `Downtown ${formattedCity} Plaza`,
      `${formattedCity} Souvenir Lane`
    ],
    "image": `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=3840&auto=format&fit=crop`
  };
}

function generateItineraryItems(destination, days, priorities) {
  const cityData = getOrGenerateCityData(destination);
  const items = [];
  for (let i = 1; i <= days; i++) {
    let morningActivity = priorities[0];
    let afternoonActivity = priorities[1];
    let eveningActivity = priorities[2];
    if (i % 2 === 0) {
      morningActivity = priorities[1];
      afternoonActivity = priorities[0];
    }
    const pick = (activityType, offset) => {
      const list = cityData[activityType];
      if (!list || list.length === 0) return `${activityType} near ${destination}`;
      return list[(i + offset) % list.length];
    };

    items.push({
      day: i,
      morning: { type: morningActivity, place: pick(morningActivity, 0) },
      afternoon: { type: afternoonActivity, place: pick(afternoonActivity, 1) },
      evening: { type: eveningActivity, place: pick(eveningActivity, 2) }
    });
  }
  return items;
}

// Create itinerary
router.post('/', auth, async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: { message: error.message } });

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const items = generateItineraryItems(value.destination, value.days, value.priorities);

    const db = await getDb();
    await db.run('INSERT INTO itineraries (id, user_id, destination, days, priorities, items, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', id, req.user.id, value.destination, value.days, JSON.stringify(value.priorities), JSON.stringify(items), createdAt);

    res.status(201).json({ data: { id, destination: value.destination, days: value.days, priorities: value.priorities, items } });
  } catch (err) {
    next(err);
  }
});

// List user's itineraries
router.get('/', auth, async (req, res, next) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT id, destination, days, priorities, items, created_at, updated_at FROM itineraries WHERE user_id = ? ORDER BY created_at DESC', req.user.id);
    const data = rows.map(r => ({ ...r, priorities: JSON.parse(r.priorities), items: JSON.parse(r.items) }));
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

// Get single itinerary
router.get('/:id', auth, async (req, res, next) => {
  try {
    const db = await getDb();
    const row = await db.get('SELECT id, destination, days, priorities, items, created_at, updated_at, user_id FROM itineraries WHERE id = ?', req.params.id);
    if (!row) return res.status(404).json({ error: { message: 'Not found' } });
    if (row.user_id !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });
    row.priorities = JSON.parse(row.priorities);
    row.items = JSON.parse(row.items);
    delete row.user_id;
    res.json({ data: row });
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const db = await getDb();
    const row = await db.get('SELECT user_id FROM itineraries WHERE id = ?', req.params.id);
    if (!row) return res.status(404).json({ error: { message: 'Not found' } });
    if (row.user_id !== req.user.id) return res.status(403).json({ error: { message: 'Forbidden' } });
    await db.run('DELETE FROM itineraries WHERE id = ?', req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
