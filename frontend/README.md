# AI Scam Shield - Frontend

React/Next.js frontend for the AI Scam Shield application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Start development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Features

- **Message Scanner**: Paste text and get scam classification
- **URL Scanner**: Check links for threats
- **Dashboard**: View scan history and statistics
- **Real-time Results**: Instant feedback with confidence scores

## Pages

- `/` - Home/Scanner page
- `/dashboard` - Scan history and stats (coming soon)

## Components

- `ScanForm` - Input form for messages/URLs
- `ResultCard` - Display scan results with color-coded risk levels

## Styling

Uses **Tailwind CSS** for styling. Custom colors:

- `danger` (red) - Malicious/Scam
- `warning` (yellow) - Suspicious
- `success` (green) - Safe

## API Integration

Frontend calls backend at `http://localhost:5000`:

- `POST /api/scan/message` - Classify text
- `POST /api/scan/url` - Check URL
- `GET /api/scan/history/:userId` - Get user scan history
