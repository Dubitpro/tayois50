import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

async function startServer() {
  const app = express();
  // PORT must remain 3000 for AI Studio preview.
  // For cPanel Node.js deployments, Passenger will automatically intercept the listen call,
  // or you can change this to process.env.PORT || 3000 after exporting the project.
  const PORT = 3000;

  app.use(express.json());

  // Set up multer for file uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
  });

  app.post('/api/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    // Return the URL to access the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Serve uploads publicly in all environments
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  const WISHES_FILE = path.join(process.cwd(), 'wishes.json');

  // Initialize wishes file if it doesn't exist
  try {
    await fs.access(WISHES_FILE);
  } catch {
    await fs.writeFile(WISHES_FILE, JSON.stringify([
      { id: '1', name: "King Charles", country: "United Kingdom", message: "A truly magnificent milestone for an extraordinary leader. Happy Golden Jubilee.", createdAt: new Date().toISOString(), likes: 0 },
      { id: '2', name: "Amelia Windsor", country: "Monaco", message: "Fifty years of grace, resilience, and unyielding elegance. The world celebrates you today.", createdAt: new Date().toISOString(), likes: 0 },
      { id: '3', name: "Sheikh Mohammed", country: "UAE", message: "Your visionary leadership has bridged continents. Wishing you a joyous and blessed Jubilee.", createdAt: new Date().toISOString(), likes: 0 },
      { id: '4', name: "Victoria Beckham", country: "United Kingdom", message: "An icon of timeless style and strength. Happy Birthday to our glorious Queen.", createdAt: new Date().toISOString(), likes: 0 },
      { id: '5', name: "Prime Minister", country: "Canada", message: "We honor your decades of service and dedication to global peace.", createdAt: new Date().toISOString(), likes: 0 },
      { id: '6', name: "Elena Romanova", country: "Italy", message: "May your golden years be as radiant as the legacy you've built.", createdAt: new Date().toISOString(), likes: 0 }
    ], null, 2));
  }

  const CONFIG_FILE = path.join(process.cwd(), 'config.json');

  // Initialize config file if it doesn't exist
  try {
    await fs.access(CONFIG_FILE);
  } catch {
    await fs.writeFile(CONFIG_FILE, JSON.stringify({
      countdownDate: "2026-08-09T00:00:00",
      heroTitleTop: "Celebrating 50 Glorious Years",
      heroTitleMain: "Golden Jubilee",
      heroCaptions: [
        "A life beautified by God’s mercy",
        "Vessel of divine brilliance",
        "Demonstration of his unconditional love",
        "Evidence of heaven’s gentle touch.",
        "Living proof that God still does wonders"
      ],
      galleryImages: [
        "https://i.pinimg.com/originals/0b/5f/13/0b5f13ee309e4aa2e9b3d7d864a235d0.jpg",
        "https://i.pinimg.com/originals/21/eb/ca/21ebcaaad4d28a822e9e149c166428d1.jpg",
        "https://i.pinimg.com/originals/2b/00/ab/2b00abecb4527f39e493600010d73c21.jpg",
        "https://i.pinimg.com/originals/3a/c4/23/3ac4237586ca6f6287e076e4a67a95f9.jpg",
        "https://i.pinimg.com/originals/3c/91/1f/3c911fb1d8d2c01addc7b05267f3eb83.jpg",
        "https://i.pinimg.com/originals/79/68/6c/79686c6940d1dbaab2cec8f8edeeef8e.jpg",
        "https://i.pinimg.com/originals/84/f1/b0/84f1b0c535be0b1ca9746f8f37312e5f.jpg",
        "https://i.pinimg.com/originals/b0/56/35/b05635f79a1ed01406ea1d0c7dea1741.jpg",
        "https://i.pinimg.com/originals/cb/46/01/cb4601f1a7763f83069120039c5199aa.jpg",
        "https://i.pinimg.com/originals/db/d8/d2/dbd8d22ef61d0b9d4786ed5708640568.jpg",
        "https://i.pinimg.com/originals/e6/6e/70/e66e7002bd1476084ddb834e1f3d1783.jpg",
        "https://i.pinimg.com/originals/e8/e0/4a/e8e04ad75b29e2cf0918a4100eedce1d.jpg"
      ]
    }, null, 2));
  }

  app.get("/api/config", async (req, res) => {
    try {
      const data = await fs.readFile(CONFIG_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch config." });
    }
  });

  app.post("/api/config", async (req, res) => {
    try {
      const config = req.body;
      await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to save config." });
    }
  });

  app.get("/api/wishes", async (req, res) => {
    try {
      const data = await fs.readFile(WISHES_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishes." });
    }
  });

  app.post("/api/wishes/:id/like", async (req, res) => {
    try {
      const data = await fs.readFile(WISHES_FILE, "utf-8");
      const wishes = JSON.parse(data);
      const wishIndex = wishes.findIndex((w: any) => w.id === req.params.id);
      
      if (wishIndex === -1) {
        return res.status(404).json({ error: "Wish not found" });
      }

      wishes[wishIndex].likes = (wishes[wishIndex].likes || 0) + 1;
      await fs.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2));
      
      res.json(wishes[wishIndex]);
    } catch (error) {
      res.status(500).json({ error: "Failed to like wish." });
    }
  });

  app.post("/api/wishes", async (req, res) => {
    try {
      const { name, country, message } = req.body;
      if (!name || !country || !message) return res.status(400).json({ error: "Missing fields" });
      
      const data = await fs.readFile(WISHES_FILE, "utf-8");
      const wishes = JSON.parse(data);
      const newWish = { id: Date.now().toString(), name, country, message, createdAt: new Date().toISOString(), likes: 0 };
      wishes.unshift(newWish);
      await fs.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2));
      
      res.json(newWish);
    } catch (error) {
      res.status(500).json({ error: "Failed to save wish." });
    }
  });

  const syncSocialComments = async () => {
    const fbToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const fbPostId = process.env.FACEBOOK_POST_ID;
    const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const igMediaId = process.env.INSTAGRAM_MEDIA_ID;

    if (!fbToken && !igToken) {
      return { error: "Social integration not configured." };
    }

    try {
      const data = await fs.readFile(WISHES_FILE, "utf-8");
      const wishes = JSON.parse(data);
      let newWishesCount = 0;

      // Sync Facebook
      if (fbToken && fbPostId) {
        try {
          const fbResponse = await fetch(`https://graph.facebook.com/v19.0/${fbPostId}/comments?access_token=${fbToken}`);
          if (fbResponse.ok) {
            const fbData = await fbResponse.json();
            for (const comment of fbData.data || []) {
              if (!wishes.find((w: any) => w.id === `fb_${comment.id}`)) {
                wishes.unshift({
                  id: `fb_${comment.id}`,
                  name: comment.from?.name || "Facebook User",
                  country: "Facebook",
                  message: comment.message,
                  createdAt: comment.created_time,
                  likes: 0
                });
                newWishesCount++;
              }
            }
          }
        } catch (e) {
          console.error("Facebook sync error:", e);
        }
      }

      // Sync Instagram
      if (igToken && igMediaId) {
        try {
          const igResponse = await fetch(`https://graph.facebook.com/v19.0/${igMediaId}/comments?access_token=${igToken}`);
          if (igResponse.ok) {
            const igData = await igResponse.json();
            for (const comment of igData.data || []) {
              if (!wishes.find((w: any) => w.id === `ig_${comment.id}`)) {
                wishes.unshift({
                  id: `ig_${comment.id}`,
                  name: comment.username || "Instagram User",
                  country: "Instagram",
                  message: comment.text,
                  createdAt: comment.timestamp,
                  likes: 0
                });
                newWishesCount++;
              }
            }
          }
        } catch (e) {
          console.error("Instagram sync error:", e);
        }
      }

      if (newWishesCount > 0) {
        await fs.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2));
      }
      return { success: true, count: newWishesCount };
    } catch (error) {
      console.error("Social sync error:", error);
      return { error: "Failed to sync social comments." };
    }
  };

  // Run automatic sync every 10 minutes
  setInterval(async () => {
    console.log("Running automatic social sync...");
    const result = await syncSocialComments();
    if (result.success && result.count! > 0) {
      console.log(`Auto-sync pulled ${result.count} new comments.`);
    }
  }, 10 * 60 * 1000);

  app.post("/api/sync-social", async (req, res) => {
    const result = await syncSocialComments();
    if (result.error) {
      if (result.error === "Social integration not configured.") {
        return res.status(400).json({ error: "Social integration not configured. Please set FACEBOOK_ACCESS_TOKEN or INSTAGRAM_ACCESS_TOKEN in your environment variables. You must create a Meta Developer App and generate access tokens to use this feature." });
      }
      return res.status(500).json({ error: result.error });
    }
    res.json({ success: true, message: `Synced ${result.count} new comments.` });
  });

  // API Route: Generate AI Tribute
  app.post("/api/generate-tribute", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const { name, country, tone } = req.body;

      const prompt = `Write a short, highly elegant and luxurious 50th Golden Jubilee birthday tribute for The Queen.
      The tribute should be signed by ${name} from ${country}.
      Tone: ${tone || 'respectful, and poetic'}.
      Keep it under 3 sentences. No placeholders. Just the message.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ message: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate tribute." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
