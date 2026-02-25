import express from 'express';
import fs from 'fs';
import urlStore from './store.js';
import bufferedSave from './persistence.js';

const app = express();

if (fs.existsSync("./storage.json")) {
  const data = fs.readFileSync("./storage.json", "utf-8");
  if (data.trim()) {
    Object.assign(urlStore, JSON.parse(data));
  }
}

app.use(express.json());
app.use(express.static("public"));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.post("/shorten", (req, res) => {
  const { url, alias } = req.body;

  if (!url || !alias) {
    return res.status(400).json({ error: "URL and alias required" });
  }

  if (urlStore[alias]) {
    return res.status(400).json({ error: "Alias already taken" });
  }

  const now = new Date().toISOString();

  urlStore[alias] = {
    originalUrl: url,
    clicks: 0,
    isDeleted: false,
    createdAt: now,
    updatedAt: now
  };

  bufferedSave(urlStore);

  return res.status(201).json({
    message: "Short link created",
    shortUrl: `${req.protocol}://${req.get("host")}/${alias}`
  });
});


app.get("/:alias", (req, res) => {
  const { alias } = req.params;

  const link = urlStore[alias];

  if (!link || link.isDeleted) {
    return res.status(404).json({ error: "Link not found" });
  }

  link.clicks++;
  link.updatedAt = new Date().toISOString();

  let milestone = null;
  if ([2,10,20,50,100].includes(link.clicks)) {
    milestone = (`🔥 ${alias} hit ${link.clicks} clicks!`);
    console.log(milestone);
  }

  bufferedSave(urlStore);

  // If request expects JSON (UI fetch call)
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(200).json({
      originalUrl: link.originalUrl,
      clicks: link.clicks,
      milestone
    });
  }

  // Otherwise normal redirect
  return res.redirect(302, link.originalUrl);
});

app.delete("/:alias", (req, res) => {
  const { alias } = req.params;

  const link = urlStore[alias];

  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }

  link.isDeleted = true;
  link.updatedAt = new Date().toISOString();

  bufferedSave(urlStore);

  return res.status(200).json({ message: "Link soft deleted" });
});


app.patch("/:alias/restore", (req, res) => {
  const { alias } = req.params;

  const link = urlStore[alias];

  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }

  link.isDeleted = false;
  link.updatedAt = new Date().toISOString();

  bufferedSave(urlStore);

  return res.status(200).json({ message: "Link restored" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});