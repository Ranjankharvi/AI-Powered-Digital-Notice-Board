const initFirebase = require('../config/firebase');
const Subscription = require('../models/Subscription');
const NotificationLog = require('../models/NotificationLog');

async function sendCategoryNotification({ notice, title, body }) {
  const admin = initFirebase();

  if (!admin) {
    await NotificationLog.create({
      notice: notice._id,
      category: notice.category,
      recipients: 0,
      status: 'skipped',
      error: 'Firebase not configured',
    });
    return;
  }

  const subscriptions = await Subscription.find({
    categories: { $in: [notice.category] },
  });

  // Filter out development mock tokens
  const tokens = subscriptions
    .map((s) => s.token)
    .filter((token) => !token.startsWith('dev-mock-token-'));

  if (!tokens.length) {
    await NotificationLog.create({
      notice: notice._id,
      category: notice.category,
      recipients: 0,
      status: 'skipped',
      error: 'No subscriptions found',
    });
    return;
  }

  try {
    const messaging = admin.messaging();

    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: title || notice.title,
        body: body || notice.summary?.short || 'New notice published',
      },
      data: {
        noticeId: notice._id.toString(),
        category: notice.category,
      },
    });

    await NotificationLog.create({
      notice: notice._id,
      category: notice.category,
      recipients: tokens.length,
      status: 'sent',
      error: response.failureCount ? `${response.failureCount} failures` : null,
    });
  } catch (err) {
    await NotificationLog.create({
      notice: notice._id,
      category: notice.category,
      recipients: tokens.length,
      status: 'failed',
      error: err.message,
    });
  }
}

module.exports = {
  sendCategoryNotification,
};

