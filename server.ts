import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const WISHES_FILE = path.join(process.cwd(), 'wishes.json');

  // Initialize wishes file if it doesn't exist
  try {
    await fs.access(WISHES_FILE);
  } catch {
    await fs.writeFile(WISHES_FILE, JSON.stringify([
      { id: '1', name: "King Charles", country: "United Kingdom", message: "A truly magnificent milestone for an extraordinary leader. Happy Golden Jubilee.", createdAt: new Date().toISOString() },
      { id: '2', name: "Amelia Windsor", country: "Monaco", message: "Fifty years of grace, resilience, and unyielding elegance. The world celebrates you today.", createdAt: new Date().toISOString() },
      { id: '3', name: "Sheikh Mohammed", country: "UAE", message: "Your visionary leadership has bridged continents. Wishing you a joyous and blessed Jubilee.", createdAt: new Date().toISOString() },
      { id: '4', name: "Victoria Beckham", country: "United Kingdom", message: "An icon of timeless style and strength. Happy Birthday to our glorious Queen.", createdAt: new Date().toISOString() },
      { id: '5', name: "Prime Minister", country: "Canada", message: "We honor your decades of service and dedication to global peace.", createdAt: new Date().toISOString() },
      { id: '6', name: "Elena Romanova", country: "Italy", message: "May your golden years be as radiant as the legacy you've built.", createdAt: new Date().toISOString() }
    ], null, 2));
  }

  app.get("/api/wishes", async (req, res) => {
    try {
      const data = await fs.readFile(WISHES_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishes." });
    }
  });

  app.post("/api/wishes", async (req, res) => {
    try {
      const { name, country, message } = req.body;
      if (!name || !country || !message) return res.status(400).json({ error: "Missing fields" });
      
      const data = await fs.readFile(WISHES_FILE, "utf-8");
      const wishes = JSON.parse(data);
      const newWish = { id: Date.now().toString(), name, country, message, createdAt: new Date().toISOString() };
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
      server: { middlewareMode: true },
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
