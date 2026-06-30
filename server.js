const express  = require("express");
const axios    = require("axios");
const cheerio  = require("cheerio");
const path     = require("path");
const http     = require("http");
const { WebSocketServer } = require("ws");
const os       = require("os");

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── EXPLICIT PAGE ROUTES ──────────────────────────────────────────────────────
app.get("/tally", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "tally.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── IN-MEMORY OG STORE ────────────────────────────────────────────────────────
// Structure: ogStore[constituencyKey][roundNum][candidateName] = count
let ogStore = {};
// Active ECI constituencies being tracked
let constituencies = {}; // key -> { acName, parties: [{name,short,color}] }

// ── WEBSOCKET BROADCAST ───────────────────────────────────────────────────────
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

wss.on("connection", (ws) => {
  // Send current state to new connection
  ws.send(JSON.stringify({ type: "full_state", ogStore, constituencies }));
});

// ── PARTY COLOR MAP ───────────────────────────────────────────────────────────
const PARTY_COLORS = {
  "dravida munnetra kazhagam": "#FF1111",
  "all india anna dravida munnetra kazhagam": "#0088FF",
  "naam tamilar katchi": "#9900EE",
  "tamilaga vettri kazhagam": "#FFD000",
  "tamizhaga vaazhvurimai katchi": "#00C8A0",
  "all india puratchi thalaivar makkal munnettra kazhagam": "#FF44AA",
  "bharatiya janata party": "#FF6600",
  "indian national congress": "#00BB44",
  "trinamool congress": "#88CC00",
  "communist party of india  (marxist)": "#BB00EE",
  "bahujan samaj party": "#4455FF",
  "none of the above": "#A09070",
};
function partyColor(name) {
  const lc = (name || "").toLowerCase();
  for (const [k, v] of Object.entries(PARTY_COLORS)) {
    if (lc.includes(k.slice(0, 10))) return v;
  }
  return "#C0A0FF";  // lavender for independents
}
const PARTY_SHORT_MAP = {
  "All India Anna Dravida Munnetra Kazhagam": "AIADMK",
  "Dravida Munnetra Kazhagam": "DMK",
  "Naam Tamilar Katchi": "NTK",
  "Tamilaga Vettri Kazhagam": "TVK",
  "Tamizhaga Vaazhvurimai Katchi": "TVMK",
  "All India Puratchi Thalaivar Makkal Munnettra Kazhagam": "APTMK",
  "Bharatiya Janata Party": "BJP",
  "Indian National Congress": "INC",
  "Trinamool Congress": "TMC",
  "Communist Party of India  (Marxist)": "CPI(M)",
  "Bahujan Samaj Party": "BSP",
  "None of the Above": "NOTA",
};
function shortParty(name) {
  for (const [k, v] of Object.entries(PARTY_SHORT_MAP)) {
    if (name.toLowerCase().includes(k.toLowerCase().slice(0, 8))) return v;
  }
  if (name.toLowerCase().includes("independent")) return "IND";
  return name.length > 14 ? name.slice(0, 12) + "…" : name;
}

// ── USER AGENTS ───────────────────────────────────────────────────────────────
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];
function randomUA() { return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]; }

function buildHeaders(url) {
  return {
    "User-Agent": randomUA(),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Referer": "https://results.eci.gov.in/ResultAcGenMay2026/index.htm",
    "Host": "results.eci.gov.in",
  };
}

async function fetchWithRetry(url, retries = 3) {
  let cookieJar = "";
  try {
    const warm = await axios.get("https://results.eci.gov.in/ResultAcGenMay2026/index.htm", {
      headers: buildHeaders(url), timeout: 12000, maxRedirects: 5,
    });
    const sc = warm.headers["set-cookie"];
    if (sc) cookieJar = sc.map(c => c.split(";")[0]).join("; ");
  } catch (_) {}
  await new Promise(r => setTimeout(r, 150 + Math.random() * 500));
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const headers = buildHeaders(url);
      if (cookieJar) headers["Cookie"] = cookieJar;
      const resp = await axios.get(url, {
        headers, timeout: 20000, maxRedirects: 5, decompress: true,
        validateStatus: s => s < 500,
      });
      if (resp.status === 403) throw new Error(
        "ECI returned 403 Forbidden.\n\nThis usually means:\n" +
        "• ECI has blocked automated access from your IP\n" +
        "• Try opening the URL in your browser first, then Fetch again\n" +
        "• Disable VPN/proxy if active"
      );
      if (resp.status === 404) throw new Error("Page not found (404) — check the URL.");
      return resp.data;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await new Promise(r => setTimeout(r, 900 * attempt));
    }
  }
  throw lastErr;
}

// ── ECI SCRAPE ────────────────────────────────────────────────────────────────
app.get("/api/results", async (req, res) => {
  const { url } = req.query;
  if (!url || !url.includes("results.eci.gov.in"))
    return res.status(400).json({ error: "Invalid or missing ECI URL" });
  try {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    const acName = $("h2").first().text().trim() || "Assembly Constituency";
    const bodyText = $.text();
    const roundStatusMatch = bodyText.match(/Status of EVM Round[:\s]+(\d+\/\d+)/i);
    const roundStatus = roundStatusMatch ? roundStatusMatch[1] : "—";
    const luMatch = bodyText.match(/Last Updated at (.+)/i);
    const lastUpdated = luMatch ? luMatch[1].trim() : new Date().toLocaleString("en-IN");

    const rounds = [];
    $("table").each((_, table) => {
      let roundNum = null;
      const captionText = $(table).find("thead th").first().text() +
        $(table).prev().text() + $(table).prev().prev().text();
      const rMatch = captionText.match(/Round\s+(\d+)/i);
      if (rMatch) roundNum = parseInt(rMatch[1]);
      if (!roundNum || rounds.find(r => r.round === roundNum)) return;
      const candidates = [];
      $(table).find("tbody tr, tr").each((i, row) => {
        const cells = $(row).find("td");
        if (cells.length < 4) return;
        const candidate = $(cells[0]).text().trim();
        const party     = $(cells[1]).text().trim();
        const brought   = parseInt($(cells[2]).text().replace(/,/g,"")) || 0;
        const current   = parseInt($(cells[3]).text().replace(/,/g,"")) || 0;
        const total     = parseInt($(cells[4])?.text().replace(/,/g,"")) || brought + current;
        const lc = candidate.toLowerCase();
        if (!candidate || lc === "candidate" || lc === "total" || !lc) return;
        candidates.push({ candidate, party, partyShort: shortParty(party), color: partyColor(party), brought, current, total });
      });
      if (candidates.length > 0) rounds.push({ round: roundNum, candidates });
    });
    rounds.sort((a,b) => a.round - b.round);

    // Register constituency for OG tally app
    const key = url;
    if (rounds.length > 0) {
      const last = rounds[rounds.length-1];
      constituencies[key] = {
        acName,
        url,
        parties: last.candidates.map(c => ({ name: c.candidate, short: c.partyShort, color: c.color })),
        totalRounds: rounds.length,
      };
      if (!ogStore[key]) ogStore[key] = {};
    }

    res.json({ acName, roundStatus, lastUpdated, rounds, ogKey: key });
  } catch (err) {
    console.error("Scrape error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── OG DATA APIS ──────────────────────────────────────────────────────────────

// GET all OG data for a constituency
app.get("/api/og", (req, res) => {
  const { key } = req.query;
  if (!key) return res.json(ogStore);
  res.json(ogStore[key] || {});
});

// POST: increment a candidate's vote by +1 (or custom amount)
app.post("/api/og/tally", (req, res) => {
  const { key, amount = 1 } = req.body;
  const round     = String(req.body.round);
  const candidate = String(req.body.candidate || "").trim();
  if (!key || !round || !candidate) return res.status(400).json({ error: "Missing fields" });
  if (!ogStore[key]) ogStore[key] = {};
  if (!ogStore[key][round]) ogStore[key][round] = {};
  ogStore[key][round][candidate] = ((parseInt(ogStore[key][round][candidate]) || 0) + parseInt(amount));

  const update = { type: "og_update", key, round, candidate, value: ogStore[key][round][candidate] };
  broadcast(update);
  res.json({ ok: true, value: ogStore[key][round][candidate] });
});

// POST: set a specific value (manual override)
app.post("/api/og/set", (req, res) => {
  const { key, value } = req.body;
  const round     = String(req.body.round);
  const candidate = String(req.body.candidate || "").trim();
  if (!key || !round || !candidate || value === undefined) return res.status(400).json({ error: "Missing fields" });
  if (!ogStore[key]) ogStore[key] = {};
  if (!ogStore[key][round]) ogStore[key][round] = {};
  ogStore[key][round][candidate] = parseInt(value) || 0;
  broadcast({ type: "og_update", key, round, candidate, value: ogStore[key][round][candidate] });
  res.json({ ok: true });
});

// POST: reset OG data for a round
app.post("/api/og/reset", (req, res) => {
  const { key, round } = req.body;
  if (key && round && ogStore[key]) {
    ogStore[key][round] = {};
    broadcast({ type: "og_reset", key, round });
  } else if (key && ogStore[key]) {
    ogStore[key] = {};
    broadcast({ type: "og_reset", key });
  }
  res.json({ ok: true });
});

// GET list of registered constituencies
app.get("/api/constituencies", (req, res) => {
  res.json(constituencies);
});

// ── LOCAL IP for display ───────────────────────────────────────────────────────
function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost";
}

server.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║         ECI DASHBOARD — SERVER RUNNING               ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  💻  Dashboard (laptop):  http://localhost:${PORT}        ║`);
  console.log(`║  📱  Tally App (phone):   http://${ip}:${PORT}/tally  ║`);
  console.log("║                                                      ║");
  console.log("║  Make sure phone & laptop are on SAME WiFi network   ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");
});
