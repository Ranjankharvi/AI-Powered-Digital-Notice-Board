# AI-Powered Digital Notice Board

Modern full-stack notice board that ingests PDFs, images, or raw text, performs OCR, generates AI summaries, auto-categorizes content, and alerts subscribed students with web push notifications.

## Tech Stack
- **Frontend:** Next.js 14, React 18, Tailwind CSS, Firebase Web Push
- **Backend:** Node.js, Express, MongoDB, Multer, Tesseract OCR, OpenAI (optional), Firebase Admin
- **AI Layer:** OpenAI GPT models with keyword-based fallbacks for summaries & categorization

## Features
- Admin authentication with JWT
- Drag-and-drop uploads for PDF / image / text
- OCR (Tesseract) and PDF text extraction
- AI summaries (short + bullet points + highlights)
- Auto category detection (Academic, Events, Placements, Others)
- Student portal with filters, search, pagination
- Real-time push notifications via Firebase Cloud Messaging
- Category management & subscription preferences

## Project Structure
```
backend/   # Express API, OCR/AI services, Mongo models
frontend/  # Next.js app for students + admin portal
```

## Backend Setup
```bash
cd backend
npm install
cp env.example .env   # or set env vars manually
npm run dev           # starts on http://localhost:4000
```

### Required Environment Variables (`backend/env.example`)
- `PORT` – API port (default 4000)
- `MONGODB_URI` – Mongo connection string
- `JWT_SECRET` – secret for signing tokens
- `ADMIN_REGISTRATION_CODE` – passphrase for creating admin accounts
- `OPENAI_API_KEY` / `OPENAI_MODEL` *(optional)* – enables LLM summaries
- `ALLOWED_ORIGINS` – comma-separated frontend origins
- `FIREBASE_SERVICE_ACCOUNT` *(base64 JSON)* **or** `FIREBASE_SERVICE_ACCOUNT_PATH` – enables push delivery

## Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local   # populate API + Firebase keys
npm run dev                 # starts on http://localhost:3000
```

### Required Environment Variables (`frontend/env.example`)
- `NEXT_PUBLIC_API_URL` – e.g. `http://localhost:4000`
- `NEXT_PUBLIC_FIREBASE_*` & `NEXT_PUBLIC_FIREBASE_VAPID_KEY` – standard Firebase web config

> The Firebase service worker receives the config dynamically when it is registered; no manual edits are needed once the env vars are set.

## Admin Workflow
1. Register admin via `POST /api/auth/register` with `role="admin"` and the correct `adminCode`.
2. Sign in at `/admin` to obtain a JWT (stored locally).
3. Upload notices (PDF/image/text). The backend runs OCR, AI summarization, auto-categorization, stores the notice, and notifies subscribed tokens.

## Student Workflow
1. Visit `/` to browse notices with filters/search/pagination.
2. Enable push notifications by selecting categories and granting browser permission (FCM token saved via `/api/subscriptions`).
3. Receive real-time alerts for newly published notices in subscribed categories.

## Key API Routes
- `POST /api/auth/register` – create users (admin/student)
- `POST /api/auth/login` – obtain JWT
- `GET /api/categories` – list categories (auto-seeded)
- `POST /api/categories` – create category (admin)
- `POST /api/notices/upload` – upload notice (admin + JWT)
- `GET /api/notices` – list notices with `category`, `q`, `page`, `limit`
- `POST /api/subscriptions` – register/update FCM tokens + category prefs

## Notifications
1. Create a Firebase project (Web app + Service Account).
2. Backend: provide service account via `FIREBASE_SERVICE_ACCOUNT` (base64 JSON) or `FIREBASE_SERVICE_ACCOUNT_PATH`.
3. Frontend: supply web credentials and VAPID key in `.env.local`.
4. Users opt-in; tokens persist in MongoDB and are filtered by category during broadcasts.

## Testing Checklist
- `npm run dev` (backend) & `npm run dev` (frontend) both running
- Upload sample PDF/image; verify OCR text + AI summary in MongoDB & UI
- Confirm category filters/search/pagination respond instantly
- Allow notifications in browser; upload another notice and ensure push is delivered
- Review logs in `NotificationLog` collection for troubleshooting

## Troubleshooting
- **OCR empty?** Ensure Tesseract has language data; try clearer scans.
- **AI disabled?** Without `OPENAI_API_KEY`, the system falls back to heuristic summarizer/classifier.
- **Push failures?** Check Firebase credentials and browser console errors, confirm HTTPS (or localhost) for FCM.
- **CORS / uploads:** Update `ALLOWED_ORIGINS` to include deployed frontend origin.

