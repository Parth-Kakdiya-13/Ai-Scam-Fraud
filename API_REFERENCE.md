# 📡 API Reference - AI Scam Shield

Complete API endpoint documentation with curl examples.

---

## 🔵 Base URL

**Development:** `http://localhost:5000`  
**Production:** `https://ai-scam-shield-backend.onrender.com` (after deployment)

---

## 🔐 Authentication Endpoints

### Register New User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**

```json
{
  "ok": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

### Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "ok": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

### Verify Token

```
POST /api/auth/verify
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**

```json
{
  "ok": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🛡️ Scanning Endpoints

### Classify Text Message

```
POST /api/scan/message
Content-Type: application/json

{
  "text": "Congratulations! You've won a free iPhone! Click here to claim your prize!!!",
  "userId": "507f1f77bcf86cd799439011" (optional)
}
```

**Response (200 OK):**

```json
{
  "ok": true,
  "reportId": "507f1f77bcf86cd799439012",
  "result": {
    "category": "scam",
    "score": 85,
    "reason": "Message contains typical phishing patterns: urgency, prize claim, suspicious link."
  }
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/scan/message \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Congratulations! You have won a free iPhone! Click here to claim your prize!!!",
    "userId": "507f1f77bcf86cd799439011"
  }'
```

**Expected Categories:**

- `"scam"` - High confidence it's a scam
- `"suspicious"` - Unclear, possibly fraudulent
- `"safe"` - Appears legitimate

---

### Check URL for Threats

```
POST /api/scan/url
Content-Type: application/json

{
  "url": "https://suspicious-bank-login.xyz/verify-account",
  "userId": "507f1f77bcf86cd799439011" (optional)
}
```

**Response (200 OK):**

```json
{
  "ok": true,
  "reportId": "507f1f77bcf86cd799439013",
  "result": {
    "category": "malicious",
    "score": 78,
    "url": "https://suspicious-bank-login.xyz/verify-account",
    "reason": "Combined analysis: heuristics=40, VT=3 malicious engines",
    "details": {
      "heuristics": 40,
      "virustotal": {
        "vtScore": 60,
        "malicious": 3,
        "suspicious": 2,
        "harmless": 55
      },
      "domainAge": {
        "ageScore": 30,
        "note": "Placeholder domain age check"
      }
    }
  }
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/scan/url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://suspicious-bank-login.xyz/verify-account",
    "userId": "507f1f77bcf86cd799439011"
  }'
```

**Risk Categories:**

- `"malicious"` - Confirmed threats (score > 70)
- `"suspicious"` - Uncertain threats (score 40-70)
- `"safe"` - Low/no threat detected (score < 40)

---

### Screenshot OCR & Classification

```
POST /api/scan/screenshot
Content-Type: multipart/form-data

FormData:
- file: <binary image data>
- userId: "507f1f77bcf86cd799439011" (optional)
```

**Response (200 OK):**

```json
{
  "ok": true,
  "reportId": "507f1f77bcf86cd799439014",
  "ocrText": "Sample extracted text from image. Replace with actual OCR service.",
  "entities": {
    "phones": ["+91-98765-43210"],
    "emails": ["scammer@gmail.com"],
    "upi": ["scammer@icici"],
    "urls": ["https://suspicious-link.com"]
  },
  "classification": {
    "category": "scam",
    "score": 75,
    "reason": "..."
  }
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/scan/screenshot \
  -F "file=@/path/to/image.png" \
  -F "userId=507f1f77bcf86cd799439011"
```

---

### Get Scan History

```
GET /api/scan/history/507f1f77bcf86cd799439011?limit=10
```

**Response (200 OK):**

```json
{
  "ok": true,
  "count": 3,
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "type": "message",
      "original": "Click here to win!",
      "result": {
        "category": "scam",
        "score": 85,
        "reason": "..."
      },
      "provider": "openai",
      "createdAt": "2025-11-14T10:30:00.000Z"
    }
  ]
}
```

**curl Example:**

```bash
curl http://localhost:5000/api/scan/history/507f1f77bcf86cd799439011?limit=10
```

---

## 📢 Community Reporting Endpoints

### Create Fraud Report

```
POST /api/report
Content-Type: application/json

{
  "kind": "phone",
  "identifier": "+91-98765-43210",
  "note": "Received scam call asking for bank details",
  "userId": "507f1f77bcf86cd799439011" (optional)
}
```

**Response (201 Created):**

```json
{
  "ok": true,
  "entity": {
    "id": "507f1f77bcf86cd799439015",
    "kind": "phone",
    "identifier": "+91-98765-43210",
    "reportCount": 1,
    "riskScore": 50
  }
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "phone",
    "identifier": "+91-98765-43210",
    "note": "Scam call asking for bank details",
    "userId": "507f1f77bcf86cd799439011"
  }'
```

**Supported Kinds:**

- `"phone"` - Phone numbers
- `"upi"` - UPI IDs
- `"domain"` - Website domains

---

### Lookup Fraud Entity

```
GET /api/report/fraud/phone/+91-98765-43210
```

**Response (200 OK):**

```json
{
  "ok": true,
  "entity": {
    "id": "507f1f77bcf86cd799439015",
    "kind": "phone",
    "identifier": "+91-98765-43210",
    "reportCount": 5,
    "riskScore": 75,
    "createdAt": "2025-11-13T08:15:00.000Z"
  }
}
```

**curl Example:**

```bash
curl http://localhost:5000/api/report/fraud/phone/+91-98765-43210
```

**Response (404) if not found:**

```json
{
  "error": "No reports found for this entity"
}
```

---

### List All Fraud Entities

```
GET /api/report/list?kind=phone&limit=50
```

**Response (200 OK):**

```json
{
  "ok": true,
  "count": 3,
  "entities": [
    {
      "id": "507f1f77bcf86cd799439015",
      "kind": "phone",
      "identifier": "+91-98765-43210",
      "reportCount": 5,
      "riskScore": 75
    },
    {
      "id": "507f1f77bcf86cd799439016",
      "kind": "upi",
      "identifier": "scammer@hdbank",
      "reportCount": 3,
      "riskScore": 65
    }
  ]
}
```

**curl Example:**

```bash
curl "http://localhost:5000/api/report/list?kind=phone&limit=50"
```

**Query Parameters:**

- `kind` (optional) - Filter by type: phone, upi, domain
- `limit` (optional, default 50) - Max results to return

---

## ✅ Health & Status

### Server Health Check

```
GET /api/health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "message": "AI Scam Shield Backend is running"
}
```

**curl Example:**

```bash
curl http://localhost:5000/api/health
```

---

## 🚨 Error Responses

### 400 Bad Request

```json
{
  "error": "Text is required"
}
```

### 401 Unauthorized

```json
{
  "error": "Invalid email or password"
}
```

### 404 Not Found

```json
{
  "error": "Route not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to classify message: API error"
}
```

---

## 📝 Request/Response Formats

### JSON Request

```
Content-Type: application/json

{
  "key": "value",
  "number": 42,
  "boolean": true
}
```

### Multipart Form (for files)

```
Content-Type: multipart/form-data

file: <binary>
userId: "123"
```

### Bearer Token (for auth)

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔄 Rate Limiting (Coming Soon)

Current MVP has no rate limits. For production, add:

- 100 requests per 15 minutes per IP
- Contact support for higher limits

---

## 📚 Testing with Postman

1. **Import Collection:**

   - Create new collection "AI Scam Shield"
   - Add each endpoint as a request

2. **Set Variables:**

   - Base URL: `{{BASE_URL}}`
   - JWT Token: `{{TOKEN}}`

3. **Test Order:**
   - Register user
   - Copy token from response
   - Set `{{TOKEN}}` variable
   - Test scan endpoints with token

---

## 🚀 Integration Examples

### JavaScript/Fetch

```javascript
const response = await fetch("http://localhost:5000/api/scan/message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Click to win!" }),
});
const data = await response.json();
console.log(data.result);
```

### Python/Requests

```python
import requests

response = requests.post(
    'http://localhost:5000/api/scan/message',
    json={'text': 'Click to win!'}
)
data = response.json()
print(data['result'])
```

### cURL (bash)

```bash
curl -X POST http://localhost:5000/api/scan/message \
  -H "Content-Type: application/json" \
  -d '{"text":"Click to win!"}'
```

---

## 💡 Common Use Cases

### 1. Scan a Message

```bash
curl -X POST http://localhost:5000/api/scan/message \
  -H "Content-Type: application/json" \
  -d '{"text":"Your account has been locked. Click here to verify."}'
```

### 2. Check a URL

```bash
curl -X POST http://localhost:5000/api/scan/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://paypal-verify.xyz"}'
```

### 3. Report a Phone Number

```bash
curl -X POST http://localhost:5000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "phone",
    "identifier": "+1-555-0100",
    "note": "Called asking for credit card info"
  }'
```

### 4. Check Reports for a Number

```bash
curl http://localhost:5000/api/report/fraud/phone/+1-555-0100
```

---

**Last Updated:** November 14, 2025

For more details, see `README.md` or `QUICKSTART.md`
