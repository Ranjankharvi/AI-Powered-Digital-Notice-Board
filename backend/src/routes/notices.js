const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const Notice = require('../models/Notice');
const { extractTextFromImage } = require('../services/ocr');
const { extractTextFromPDF } = require('../services/pdf');
const { generateAIContent, categorizeNotice } = require('../services/ai');
const { sendCategoryNotification } = require('../services/notifications');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    if (!allowed.includes(ext)) {
      return cb(new Error('Only PDF and image files are allowed'));
    }
    return cb(null, true);
  },
});

const cleanText = (text = '') =>
  text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n]+/g, '')
    .trim();

const safeUnlink = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, () => {});
};

router.post(
  '/upload',
  authenticate,
  requireAdmin,
  upload.single('file'),
  [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('text').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { file } = req;
    let extractedText = cleanText(req.body.text);

    try {
      if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.pdf') {
          extractedText = await extractTextFromPDF(file.path);
        } else {
          extractedText = await extractTextFromImage(file.path);
        }
      }

      extractedText = cleanText(extractedText);

      if (!extractedText) {
        safeUnlink(file?.path);
        return res.status(400).json({ error: 'No text extracted or provided' });
      }

      const summary = await generateAIContent(extractedText);
      const category = req.body.category || (await categorizeNotice(extractedText));

      let normalizedTags = [];
      if (Array.isArray(req.body.tags)) {
        normalizedTags = req.body.tags;
      } else if (typeof req.body.tags === 'string') {
        normalizedTags = req.body.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      const notice = await Notice.create({
        title: req.body.title || summary.short || 'Untitled Notice',
        description: req.body.description,
        originalFileName: file ? file.originalname : undefined,
        originalFileType: file ? file.mimetype : undefined,
        fileUrl: file ? `/uploads/${path.basename(file.path)}` : undefined,
        extractedText,
        summary,
        category,
        tags: normalizedTags,
        uploadedBy: req.user._id,
      });

      sendCategoryNotification({
        notice,
        title: notice.title,
      }).catch((err) => console.warn('Notification failed', err.message));

      res.status(201).json({ notice });
    } catch (err) {
      safeUnlink(file?.path);
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const { category, q, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$text = { $search: q };

    const query = Notice.find(filter).sort({ publishedAt: -1 });

    const total = await Notice.countDocuments(filter);
    const notices = await query
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({
      notices,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json({ notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    // Delete the uploaded file if it exists
    if (notice.fileUrl) {
      const filePath = path.join(uploadDir, path.basename(notice.fileUrl));
      safeUnlink(filePath);
    }

    // Delete the notice from database
    await Notice.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
