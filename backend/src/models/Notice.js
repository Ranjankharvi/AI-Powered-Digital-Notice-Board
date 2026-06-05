const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema(
  {
    short: String,
    bullets: [String],
    highlights: [String],
  },
  { _id: false }
);

const NoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    originalFileName: String,
    originalFileType: String,
    fileUrl: String,
    extractedText: {
      type: String,
      required: true,
    },
    summary: {
      type: SummarySchema,
      default: {},
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: [String],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

NoticeSchema.index({ title: 'text', extractedText: 'text', 'summary.short': 'text' });

module.exports = mongoose.model('Notice', NoticeSchema);
