# ECI Live Results Dashboard v3

## What's new in v3
- Light / Dark mode toggle
- Page 1: Dashboard (real ECI numbers only)
- Page 2: Analytics (win probability, trends, map)
- OG Tally Mobile App (run on Android phone)
- Real-time WebSocket sync between phone and dashboard

---

## Setup (2 minutes)

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version)

### Step 2 — Open folder in VS Code
File → Open Folder → select `eci-dashboard`

### Step 3 — Open terminal
Press Ctrl + ` (backtick)

### Step 4 — Install dependencies
```
npm install
```

### Step 5 — Start the server
```
npm start
```

You will see:
```
╔══════════════════════════════════════════════════════╗
║         ECI DASHBOARD — SERVER RUNNING               ║
╠══════════════════════════════════════════════════════╣
║  💻  Dashboard (laptop):  http://localhost:3000        ║
║  📱  Tally App (phone):   http://192.168.x.x:3000/tally ║
╚══════════════════════════════════════════════════════╝
```

### Step 6 — Open dashboard on laptop
http://localhost:3000

### Step 7 — Open tally app on Android phone
- Make sure phone and laptop are on SAME WiFi
- Open Chrome on phone
- Go to http://192.168.x.x:3000/tally  (use the IP shown in terminal)
- Tap ⋮ → "Add to Home Screen" to install as app icon

---

## How OG Tally works
1. On laptop: paste ECI URL, click FETCH LIVE DATA
2. On phone: open tally app → constituency appears → select it
3. Select round → tap +1 +5 +10 for each candidate as votes come in
4. Every tap instantly syncs to dashboard (real-time WebSocket)
5. On dashboard: click 🔄 OG REFRESH to pull all OG data
6. OG data shows as a separate blue column — never mixed with ECI official data

---

## Dependencies
- express — web server
- axios — fetch ECI pages
- cheerio — parse HTML
- ws — WebSocket for real-time phone↔dashboard sync
