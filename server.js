import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Twój token NOAA
const API_TOKEN = "wBtiiKzDVwzqmJPIRlrMnJIBQGjTMsZA";
const API_BASE = "https://www.ncei.noaa.gov/cdo-web/api/v2/data";

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


async function proxyFetch(query = "") {
  const response = await fetch(`${API_BASE}${query}`, {
    headers: { token: API_TOKEN },
  });


  if (!response.ok) {
    const text = await response.text();
    throw new Error(`NOAA ${response.status}: ${text}`);
  }

  return await response.json();
}


app.get("/stations", async (req, res) => {
  try {
    const data = await proxyFetch("/stations");
    res.json(data);
  } catch (err) {
    console.error("Błąd proxy /stations:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/datasets", async (req, res) => {
  try {
    const data = await proxyFetch("/datasets");
    res.json(data);
  } catch (err) {
    console.error("Błąd proxy /datasets:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/data", async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    const data = await proxyFetch(`?${query}`);
    res.json(data);
  } catch (err) {
    console.error("Błąd proxy /data:", err.message);
    res.status(500).json({ error: err.message });
  }
});



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
