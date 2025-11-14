# AI Scam Shield Backend

Node.js/Express backend for the AI Scam Shield application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Add your API keys to `.env`:

   - `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
   - `MONGO_URI` - MongoDB connection string (Atlas or local)
   - `VIRUSTOTAL_API_KEY` - Get from https://www.virustotal.com/gui/home/upload
   - `JWT_SECRET` - Generate a random secret

4. Start development server:

```bash
npm run dev
```

Or production:

```bash
npm start
```

Server runs on `http://localhost:5000`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Scanning

- `POST /api/scan/message` - Classify text message
- `POST /api/scan/url` - Check URL for threats
- `POST /api/scan/screenshot` - OCR and classify image
- `GET /api/scan/history/:userId` - Get user's scan history

### Community Reports

- `POST /api/report` - Create fraud report (phone/upi/domain)
- `GET /api/report/fraud/:kind/:identifier` - Get reports for entity
- `GET /api/report/list` - List all fraud entities

### Health

- `GET /api/health` - Server status

## Architecture

```
src/
├── controllers/      # Route handlers
├── routes/          # Express routes
├── services/        # External API integrations
├── models/          # Mongoose schemas
└── index.js         # Server entry point
```

## Services

### openaiService.js

- `classifyMessage(text)` - Classify message as scam/suspicious/safe
- Uses Claude 3.5 Sonnet for better accuracy

### urlService.js

- `scanUrl(url)` - Comprehensive URL risk assessment
- Heuristics + VirusTotal + domain age checks

### ocrService.js

- `extractTextFromImage(buffer)` - Extract text from screenshots
- `extractEntities(text)` - Find phones, emails, UPI, URLs

## Testing

Quick test of `/api/scan/message`:

```bash
curl -X POST http://localhost:5000/api/scan/message \
  -H "Content-Type: application/json" \
  -d '{"text":"Click here to claim your prize!"}'
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

## Environment Variables

See `.env.example` for all variables needed. Key ones:

- `MONGO_URI` - MongoDB connection
- `OPENAI_API_KEY` - For message classification (required)
- `VIRUSTOTAL_API_KEY` - For URL scanning (optional)
- `JWT_SECRET` - For auth tokens

## Production Deployment

For Render/Heroku:

1. Set environment variables in dashboard
2. Use `npm start` as start command
3. Ensure MongoDB Atlas is accessible
4. Add `FRONTEND_URL` pointing to deployed frontend

## Improvements for Production

- [ ] Add rate limiting (express-rate-limit)
- [ ] Add request validation (express-validator - partially done)
- [ ] Add Sentry error tracking
- [ ] Add caching layer (Redis)
- [ ] Add API logging
- [ ] Implement file upload storage (S3)
- [ ] Add admin panel for moderation
