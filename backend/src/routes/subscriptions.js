const express = require('express');
const { body, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('token').notEmpty().withMessage('FCM token required'),
    body('categories').isArray().withMessage('Categories must be an array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { token, categories, platform = 'web', userId } = req.body;

      const payload = {
        token,
        categories,
        platform,
      };

      if (userId) payload.user = userId;

      const subscription = await Subscription.findOneAndUpdate({ token }, payload, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });

      res.status(201).json({ subscription });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/', authenticate, requireAdmin, async (_req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    res.json({ subscriptions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:token', async (req, res) => {
  try {
    await Subscription.findOneAndDelete({ token: req.params.token });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

