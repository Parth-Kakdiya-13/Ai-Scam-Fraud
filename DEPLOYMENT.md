# 🚀 Deployment & Launch Guide - AI Scam Shield

This guide covers deploying the AI Scam Shield MVP to production using **Vercel** (frontend) and **Render** (backend).

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Backend `.env` file has all required keys:
  - `MONGO_URI` - MongoDB Atlas connection
  - `OPENAI_API_KEY` - Valid OpenAI API key
  - `JWT_SECRET` - Strong random secret
  - `VIRUSTOTAL_API_KEY` (optional but recommended)
- [ ] Frontend `.env.local` configured (or Vercel env vars set)

- [ ] Both projects install cleanly:

  ```bash
  cd backend && npm install
  cd frontend && npm install
  ```

- [ ] Local testing passed:

  ```bash
  # Terminal 1
  cd backend && npm run dev

  # Terminal 2
  cd frontend && npm run dev

  # Browser: http://localhost:3000 loads ✓
  ```

---

## 🟢 Step 1: Deploy Backend (Render)

### 1.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### 1.2 Push Code to GitHub

```bash
cd e:\AI-Scam-Shield
git init
git add .
git commit -m "Initial commit: AI Scam Shield MVP"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/AI-Scam-Shield.git
git push -u origin main
```

### 1.3 Create Render Service

1. Go to https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Select your GitHub repository (`YOUR-USERNAME/AI-Scam-Shield`)
4. Configure:
   - **Name:** `ai-scam-shield-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Instance Type:** Free (or Starter for production)

### 1.4 Add Environment Variables

In Render dashboard → Your Service → **Environment**:

```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ai-scam-shield?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-actual-key-here
VIRUSTOTAL_API_KEY=your-vt-key-optional
JWT_SECRET=use-output-from-node-crypto-command-above
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### 1.5 Deploy

Click **Deploy** and wait ~3-5 minutes. You'll see:

```
Your service is live at: https://ai-scam-shield-backend.onrender.com
```

✅ **Save this URL** — you'll need it for frontend!

### 1.6 Test Backend

```bash
curl https://ai-scam-shield-backend.onrender.com/api/health
```

Expected response:

```json
{ "status": "ok", "message": "AI Scam Shield Backend is running" }
```

---

## 🔵 Step 2: Deploy Frontend (Vercel)

### 2.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Connect GitHub account

### 2.2 Deploy

1. Click **Add New...** → **Project**
2. Select your `AI-Scam-Shield` repository
3. Configure:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./frontend`
   - Leave everything else as default
4. Click **Deploy**

Vercel will build and deploy in ~2 minutes.

### 2.3 Add Environment Variable

After deployment completes:

1. Go to **Project Settings** → **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://ai-scam-shield-backend.onrender.com
   ```
3. Re-deploy to apply the env var:
   - Go to **Deployments**
   - Click the latest deployment
   - Click **Redeploy**

### 2.4 Test Frontend

Visit the Vercel URL (e.g., `https://ai-scam-shield.vercel.app`):

- Should see the AI Scam Shield homepage ✅
- Paste a test message and click "Scan Now"
- Should get a result from your backend ✅

---

## 📱 Environment Variables Reference

### Backend (Render)

| Variable             | Example                                                      | Required | Notes                                                                                     |
| -------------------- | ------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------- |
| `MONGO_URI`          | `mongodb+srv://user:pass@cluster.mongodb.net/ai-scam-shield` | ✅       | Get from MongoDB Atlas                                                                    |
| `OPENAI_API_KEY`     | `sk-...`                                                     | ✅       | Get from OpenAI dashboard                                                                 |
| `JWT_SECRET`         | Random 32-char string                                        | ✅       | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `VIRUSTOTAL_API_KEY` | Your VT key                                                  | ❌       | Optional, for enhanced URL scanning                                                       |
| `NODE_ENV`           | `production`                                                 | ✅       | Set to `production`                                                                       |
| `FRONTEND_URL`       | Vercel deployed URL                                          | ✅       | For CORS                                                                                  |
| `PORT`               | `10000`                                                      | ✅       | Render uses 10000 (not 5000)                                                              |

### Frontend (Vercel)

| Variable              | Example            | Required | Notes                           |
| --------------------- | ------------------ | -------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend Render URL | ✅       | Must have `NEXT_PUBLIC_` prefix |

---

## 🔐 Security Checklist

- [ ] **CORS enabled:** Backend's `FRONTEND_URL` points to Vercel domain
- [ ] **Secrets in ENV:** Never commit `.env` files to GitHub
- [ ] **API Keys rotated:** Regenerate keys if accidentally exposed
- [ ] **Rate limiting:** Add to backend production (see Production Tips below)
- [ ] **HTTPS enforced:** Both Vercel and Render use HTTPS by default ✓
- [ ] **MongoDB access:** Whitelist Render IP in MongoDB Atlas
  - Go to MongoDB Atlas → Network Access
  - Add IP: Allow from anywhere (0.0.0.0/0) for MVP, or whitelist Render's IP

---

## 🛠️ Production Tips

### Rate Limiting

Add to `backend/src/index.js`:

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use("/api/", limiter);
```

Install: `npm install express-rate-limit`

### Error Tracking (Sentry)

1. Create Sentry account: https://sentry.io
2. Install: `npm install @sentry/node`
3. Add to backend `src/index.js`:

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

4. Add `SENTRY_DSN` to Render env vars

### Database Backups

- MongoDB Atlas automatically backs up your data
- Download backups from Atlas Dashboard → Backup

### Monitoring

Use Render's built-in logs:

- Go to Render Dashboard → Your Service → Logs
- Check for errors in real-time

---

## 🔄 Updating Deployed Code

### Push Updates to GitHub

```bash
git add .
git commit -m "Fix: xyz feature"
git push origin main
```

### Auto-Redeploy

Both Vercel and Render automatically redeploy when you push to `main` branch. Watch the deployment logs in each dashboard.

---

## 📊 Monitoring & Alerts

### Render

- Go to your service → **Alerts**
- Add email alerts for:
  - Service crashes
  - High CPU/memory usage

### Vercel

- Go to **Settings** → **Alerts**
- Add Slack webhook for deployments

### Custom Logging

Add logging to backend `src/index.js`:

```javascript
// Log scan requests
app.post("/api/scan/:type", (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] SCAN: ${req.params.type}`);
  next();
});
```

---

## 🚨 Troubleshooting Deployment

### Backend won't start

Check Render Logs:

1. Render Dashboard → Your Service → Logs
2. Look for errors like:
   - `ECONNREFUSED` → MongoDB URI wrong
   - `401 Unauthorized` → OpenAI key invalid
   - `Cannot find module` → Missing dependency

### Frontend blank page

1. Open browser DevTools (F12)
2. Check **Console** for errors (usually CORS or API URL issues)
3. Verify `NEXT_PUBLIC_API_URL` is set in Vercel env vars
4. Redeploy frontend after changing env vars

### CORS errors

In browser console: `Access-Control-Allow-Origin` error

Fix: Ensure backend's `FRONTEND_URL` env var matches your Vercel domain exactly:

```
FRONTEND_URL=https://your-app.vercel.app  (NOT https://your-app.vercel.app/)
```

### MongoDB connection timeout

1. Check IP whitelist in MongoDB Atlas → Network Access
2. For MVP: Add `0.0.0.0/0` (allow all)
3. Verify `MONGO_URI` includes username, password, and database name

---

## 📈 Scaling (After MVP Launch)

### When to upgrade:

- Render: Free → Starter/Standard when traffic increases
- MongoDB: Free tier (512MB) → Shared (2GB) or Dedicated

### Cost estimates (monthly):

- Vercel: Free-$20 (depends on usage)
- Render: Free-$50+ (scales with CPU/memory)
- MongoDB: Free-$57+ (depends on storage/throughput)

---

## 🎯 Launch Checklist (Final)

### Pre-Launch

- [ ] Backend health check passes: `/api/health`
- [ ] Frontend loads without errors
- [ ] Message scan works end-to-end
- [ ] User auth (register/login) works
- [ ] Rate limiting configured
- [ ] Error tracking (Sentry) configured
- [ ] Security headers added

### Launch Day

- [ ] Announce on social media
- [ ] Monitor logs for errors
- [ ] Watch for scaling issues
- [ ] Have runbook ready for common issues

### Post-Launch

- [ ] Collect user feedback
- [ ] Fix bugs as reported
- [ ] Optimize based on usage patterns
- [ ] Plan next features

---

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.mongodb.com/atlas/
- **OpenAI API Docs:** https://platform.openai.com/docs/
- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com/

---

## 🎓 Next Steps After MVP Launch

1. **Collect data:** Log scan results to improve model
2. **Add features:**
   - Browser extension
   - Admin dashboard
   - Analytics
   - Webhooks/API for partners
3. **Fine-tune ML:** Use collected scam reports to improve classification
4. **Enterprise features:**
   - Bank integrations
   - E-commerce platform support
   - Slack alerts
5. **Self-host LLM:** Replace OpenAI with fine-tuned LLaMA to reduce costs

---

**Questions?** Check the main README.md or individual backend/frontend README files.

Happy launching! 🚀
