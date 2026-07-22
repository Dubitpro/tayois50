import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

async function startServer() {
  const app = express();
  // PORT must remain 3000 for AI Studio preview.
  // For cPanel Node.js deployments, Passenger will automatically intercept the listen call,
  // or you can change this to process.env.PORT || 3000 after exporting the project.
  const PORT = 3000;

  app.use(express.json());

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
      heroTitleTop: "Celebrating 50 \n Glorious Years",
      heroTitleMain: "Golden Jubilee",
      heroCaptions: [
        "A life beautified by God’s mercy",
        "Vessel of divine brilliance",
        "Demonstration of his unconditional love",
        "Evidence of heaven’s gentle touch.",
        "Living proof that God still does wonders"
      ],
      galleryImages: [
        "https://i.pinimg.com/736x/5b/fe/d7/5bfed7298601ac9c981fd5cb03a46fa5.jpg",
        "https://i.pinimg.com/736x/f6/3a/a3/f63aa3c3206dfd2baf03eb4782110437.jpg",
        "https://i.pinimg.com/736x/34/d0/fb/34d0fb4b34acbdb6bb12783d90cf52bf.jpg",
        "https://i.pinimg.com/736x/18/33/4d/18334d4c223e87552566d28216d713c1.jpg",
        "https://i.pinimg.com/736x/58/ea/81/58ea81c3aa505de6b5fd63e2a408b56f.jpg",
        "https://i.pinimg.com/736x/f2/9e/12/f29e12626f56a6378a98fb6c2b8fb04f.jpg",
        "https://i.pinimg.com/736x/1f/9d/99/1f9d9970b2625b05ce20e5f7010c2bf8.jpg",
        "https://i.pinimg.com/736x/ed/bc/cc/edbccc2010e98c50d5cc013e7f7ad146.jpg",
        "https://i.pinimg.com/736x/1d/50/60/1d50608f161ad14553b1bd4c7dd7abd3.jpg"
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

  // API Route: Generate AI Royal Tribute
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

      const prompt = `Write a short, highly elegant and luxurious 50th Golden Jubilee birthday tribute for Her Majesty The Queen.
      The tribute should be signed by ${name} from ${country}.
      Tone: ${tone || 'respectful, royal, and poetic'}.
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
