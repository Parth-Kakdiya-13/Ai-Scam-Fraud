# 🛡️ AI Scam Shield - MVP

A full-stack web application that uses AI and threat intelligence APIs to detect scams, fraudulent messages, and malicious URLs in real-time.

## 📁 Project Structure

```
ai-scam-shield/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # External API wrappers
│   │   ├── models/       # Mongoose schemas
│   │   └── index.js      # Server entry
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/             # Next.js React app
│   ├── pages/            # Next.js pages
│   ├── components/       # Reusable components
│   ├── styles/           # Global CSS
│   ├── package.json
│   ├── next.config.js
│   └── README.md
│
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- API Keys:
  - [OpenAI](https://platform.openai.com) - `sk-...`
  - [VirusTotal](https://www.virustotal.com) (optional)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys
npm run dev
# Server starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:3000
```

## 🎯 Features

- **Message Classification**: Paste text → AI analysis → scam/safe/suspicious
- **URL Risk Scanning**: Check links against threat intelligence databases
- **Screenshot OCR**: Upload images → extract text → classify content
- **User Accounts**: Register, login, track scan history
- **Community Reports**: Report fraudulent phone numbers, UPI IDs, domains
- **Real-time Threat Data**: Integration with VirusTotal, urlscan.io

## 📡 API Routes

### Scan Endpoints

```
POST /api/scan/message       # Classify text
POST /api/scan/url           # Check URL
POST /api/scan/screenshot    # OCR + classify image
GET  /api/scan/history/:userId
```

### Auth Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify
```

### Report Endpoints

```
POST /api/report             # Create fraud report
GET  /api/report/fraud/:kind/:identifier
GET  /api/report/list        # All fraud entities
```

## 🔑 Environment Variables

Create `backend/.env`:

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-scam-shield
OPENAI_API_KEY=sk-...
VIRUSTOTAL_API_KEY=...
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🧪 Testing

### Backend Health Check

```bash
curl http://localhost:5000/api/health
```

### Test Message Classification

```bash
curl -X POST http://localhost:5000/api/scan/message \
  -H "Content-Type: application/json" \
  -d '{"text":"Click here to win free money!"}'
```

### Test Frontend

Visit `http://localhost:3000` and use the UI

## 📦 Tech Stack

| Layer                   | Tech                                |
| ----------------------- | ----------------------------------- |
| **Frontend**            | Next.js 14, React 18, Tailwind CSS  |
| **Backend**             | Node.js, Express, MongoDB           |
| **Authentication**      | JWT                                 |
| **AI/ML**               | OpenAI Claude API                   |
| **Threat Intelligence** | VirusTotal, urlscan.io              |
| **Database**            | MongoDB Atlas                       |
| **Hosting**             | Vercel (frontend), Render (backend) |

## 📋 MVP Checklist

- [x] Backend API structure
- [x] Frontend UI (React/Next.js)
- [x] Text message classification (OpenAI)
- [x] URL scanning service
- [x] OCR service placeholder
- [x] MongoDB models
- [x] Authentication (JWT)
- [x] Community reporting system
- [ ] Browser extension (coming)
- [ ] Admin dashboard (coming)
- [ ] Rate limiting (production)
- [ ] Error tracking (Sentry)

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

### Backend (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

**Environment vars for Render:**

- `MONGO_URI` - MongoDB connection string
- `OPENAI_API_KEY` - Your OpenAI key
- `JWT_SECRET` - Random secret string
- `FRONTEND_URL` - https://your-frontend-url.vercel.app
- `NODE_ENV` - production

## ⚠️ Disclaimer

This tool provides risk assessments and is **not legal advice**. Always verify suspicious content through official channels.

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests.

## 💡 Next Steps (Post-MVP)

- [ ] Fine-tune ML model on labeled scam dataset
- [ ] Replace OpenAI with self-hosted LLaMA
- [ ] Add Slack/webhook alerts
- [ ] Build Chrome extension (Manifest v3)
- [ ] Enterprise integration APIs
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

**Questions?** Open an issue or check the individual README files in `backend/` and `frontend/`.
