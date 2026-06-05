const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CategorySchema.pre('save', function setSlug(next) {
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slugify(this.name, { lower: true });
  return next();
});

module.exports = mongoose.model('Category', CategorySchema);

