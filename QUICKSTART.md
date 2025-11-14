# 🚀 Quick Start Guide - AI Scam Shield

## One-Time Setup

### 1. Copy environment files

**Backend:**

```bash
cd backend
cp .env.example .env
```

**Frontend:**

```bash
cd frontend
# Create .env.local (no copy needed, it's optional)
# Leave as is or add: NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Add API Keys to `backend/.env`

Get these keys from:

**OpenAI API Key** (required)

- Go to https://platform.openai.com/api-keys
- Create a new API key
- Copy & paste into `OPENAI_API_KEY=sk-...`

**MongoDB URI** (required)

- Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Create free cluster → get connection string
- Replace `<password>` in: `mongodb+srv://user:password@cluster.mongodb.net/ai-scam-shield`

**VirusTotal API Key** (optional, for URL scanning)

- Sign up at https://www.virustotal.com
- Go to API page and get your API key

**JWT Secret** (auto-generated, but change it!)

- Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Paste into `JWT_SECRET=...`

**Example `.backend/.env`:**

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ai-scam-shield
OPENAI_API_KEY=sk-your-key-here
VIRUSTOTAL_API_KEY=your-vt-key-optional
JWT_SECRET=your-long-random-secret-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Development Run

### Terminal 1: Backend Server

```bash
cd backend
npm run dev
```

✅ You should see:

```
✅ MongoDB connected
🚀 Server running on port 5000
```

### Terminal 2: Frontend Dev Server

```bash
cd frontend
npm run dev
```

✅ You should see:

```
  ▲ Next.js 14.0.0
  ✓ Ready in 2.5s
  Local: http://localhost:3000
```

### Open in Browser

```
http://localhost:3000
```

You should see the AI Scam Shield home page!

## Testing the API

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "ok", "message": "AI Scam Shield Backend is running" }
```

### 2. Test Message Scan

```bash
curl -X POST http://localhost:5000/api/scan/message \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Congratulations! You've won a free iPhone! Click here to claim your prize!!!\"}"
```

Expected response:

```json
{
  "ok": true,
  "reportId": "...",
  "result": {
    "category": "scam",
    "score": 85,
    "reason": "..."
  }
}
```

### 3. Use the Frontend UI

1. Go to http://localhost:3000
2. Select "Text Message" type
3. Paste a message like: "Click link to verify your bank account: https://bank-sercurity-check.xyz"
4. Click "Scan Now"
5. See the result with risk score!

## Troubleshooting

### MongoDB Connection Error

- [ ] Check `MONGO_URI` in `.env` (must include password)
- [ ] Check MongoDB Atlas IP whitelist (allow all for development)
- [ ] Verify database name is correct

### OpenAI API Error

- [ ] Check `OPENAI_API_KEY` is valid
- [ ] Check you have credits on OpenAI account
- [ ] Verify API key has correct permissions

### Frontend can't reach backend

- [ ] Ensure backend is running on port 5000
- [ ] Check CORS: `FRONTEND_URL` in backend `.env` should be `http://localhost:3000`
- [ ] Check browser console for exact error

### Port already in use

```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## File Structure

```
.
├── backend/
│   ├── src/
│   │   ├── index.js         ← Server entry point
│   │   ├── controllers/
│   │   │   ├── scanController.js
│   │   │   ├── authController.js
│   │   │   └── reportController.js
│   │   ├── services/
│   │   │   ├── openaiService.js   ← LLM calls
│   │   │   ├── urlService.js      ← URL threat checks
│   │   │   └── ocrService.js      ← Image extraction
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── ScanReport.js
│   │   │   └── FraudEntity.js
│   │   └── routes/
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── pages/
│   │   ├── index.js         ← Home/Scanner
│   │   └── dashboard.js
│   ├── components/
│   │   ├── ScanForm.jsx
│   │   └── ResultCard.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   └── next.config.js
│
└── README.md
```

## Next Steps

1. ✅ Start backend & frontend (see above)
2. ✅ Test with sample messages
3. ⏭️ Explore the code:
   - Add URL scanning tests
   - Implement user auth
   - Add more controllers
4. ⏭️ Deploy when ready (Vercel + Render)

## Commands Reference

```bash
# Backend
cd backend
npm run dev              # Start with auto-reload (needs nodemon)
npm start               # Start production mode
npm install             # Install deps

# Frontend
cd frontend
npm run dev             # Start dev server
npm run build          # Build for production
npm start              # Start production build
npm install            # Install deps
```

---

**Stuck?** Check the README files in `backend/` and `frontend/` folders for more details!
