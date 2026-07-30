import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if URL is provided
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Delete Cloudinary Video
  app.post("/api/delete-video", async (req, res) => {
    try {
      if (!process.env.CLOUDINARY_URL) {
        return res.status(500).json({ error: "Cloudinary is not configured." });
      }
      const { publicId } = req.body;
      if (!publicId) {
        return res.status(400).json({ error: "Missing publicId" });
      }

      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Cloudinary Delete Error:", error);
      res.status(500).json({ error: "Failed to delete video." });
    }
  });

  // API Route: Get Cloudinary Signature for client-side upload
  app.get("/api/cloudinary-signature", (req, res) => {
    try {
      if (!process.env.CLOUDINARY_URL) {
        return res.status(500).json({ error: "Cloudinary is not configured." });
      }
      
      const timestamp = Math.round((new Date).getTime() / 1000);
      const folder = "wish-wall/videos";
      
      const paramsToSign = {
        timestamp: timestamp,
        folder: folder
      };
      
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign, 
        cloudinary.config().api_secret!
      );
      
      res.json({ 
        timestamp, 
        signature, 
        folder,
        apiKey: cloudinary.config().api_key,
        cloudName: cloudinary.config().cloud_name
      });
    } catch (error: any) {
      console.error("Cloudinary Signature Error:", error);
      res.status(500).json({ error: "Failed to generate signature." });
    }
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
