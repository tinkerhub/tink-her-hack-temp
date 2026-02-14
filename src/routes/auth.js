const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const config = require('../config');

const registerSchema = Joi.object({ username: Joi.string().min(3).max(50).required(), password: Joi.string().min(6).required() });
const loginSchema = Joi.object({ username: Joi.string().required(), password: Joi.string().required() });

router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: { message: error.message } });

    const { username, password } = value;
    const hashed = bcrypt.hashSync(password, 10);
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const db = await getDb();
    await db.run('INSERT INTO users (id, username, password, created_at) VALUES (?, ?, ?, ?)', id, username, hashed, createdAt);

    res.status(201).json({ data: { id, username, createdAt } });
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: { message: 'Username already exists' } });
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: { message: error.message } });

    const { username, password } = value;
    const db = await getDb();
    const row = await db.get('SELECT id, username, password FROM users WHERE username = ?', username);
    if (!row) return res.status(401).json({ error: { message: 'Invalid credentials' } });

    const ok = bcrypt.compareSync(password, row.password);
    if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });

    const token = jwt.sign({ id: row.id, username: row.username }, config.jwtSecret, { expiresIn: '30d' });
    res.json({ data: { token } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
