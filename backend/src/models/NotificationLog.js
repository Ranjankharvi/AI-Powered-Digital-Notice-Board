const mongoose = require('mongoose');

const NotificationLogSchema = new mongoose.Schema(
  {
    notice: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice' },
    category: String,
    recipients: Number,
    status: {
      type: String,
      enum: ['sent', 'skipped', 'failed'],
      default: 'sent',
    },
    error: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotificationLog', NotificationLogSchema);

