const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    categories: [{ type: String }],
    platform: { type: String, default: 'web' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', SubscriptionSchema);

