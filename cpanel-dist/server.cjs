var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_promises = __toESM(require("fs/promises"), 1);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const WISHES_FILE = import_path.default.join(process.cwd(), "wishes.json");
  try {
    await import_promises.default.access(WISHES_FILE);
  } catch {
    await import_promises.default.writeFile(WISHES_FILE, JSON.stringify([
      { id: "1", name: "King Charles", country: "United Kingdom", message: "A truly magnificent milestone for an extraordinary leader. Happy Golden Jubilee.", createdAt: (/* @__PURE__ */ new Date()).toISOString(), likes: 0 },
      { id: "2", name: "Amelia Windsor", country: "Monaco", message: "Fifty years of grace, resilience, and unyielding elegance. The world celebrates you today.", createdAt: (/* @__PURE__ */ new Date()).toISOString(), likes: 0 },
      { id: "3", name: "Sheikh Mohammed", country: "UAE", message: "Your visionary leadership has bridged continents. Wishing you a joyous and blessed Jubilee.", createdAt: (/* @__PURE__ */ new Date()).toISOString(), likes: 0 },
      { id: "4", name: "Victoria Beckham", country: "United Kingdom", message: "An icon of timeless style and strength. Happy Birthday to our glorious Queen.", createdAt: (/* @__PURE__ */ new Date()).toISOString(), likes: 0 },
      { id: "5", name: "Prime Minister", country: "Canada", message: "We honor your decades of service and dedication to global peace.", createdAt: (/* @__PURE__ */ new Date()).toISOString(), likes: 0 },
      { id: "6", name: "Elena Romanova", country: "Italy", message: "May your golden years be as radiant as the legacy you've built.", createdAt: (/* @__PURE__ */ new Date()).toISOString(), likes: 0 }
    ], null, 2));
  }
  const CONFIG_FILE = import_path.default.join(process.cwd(), "config.json");
  try {
    await import_promises.default.access(CONFIG_FILE);
  } catch {
    await import_promises.default.writeFile(CONFIG_FILE, JSON.stringify({
      countdownDate: "2026-08-09T00:00:00",
      heroTitleTop: "Celebrating 50 \n Glorious Years",
      heroTitleMain: "Golden Jubilee",
      heroCaptions: [
        "A life beautified by God\u2019s mercy",
        "Vessel of divine brilliance",
        "Demonstration of his unconditional love",
        "Evidence of heaven\u2019s gentle touch.",
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
      const data = await import_promises.default.readFile(CONFIG_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch config." });
    }
  });
  app.post("/api/config", async (req, res) => {
    try {
      const config = req.body;
      await import_promises.default.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to save config." });
    }
  });
  app.get("/api/wishes", async (req, res) => {
    try {
      const data = await import_promises.default.readFile(WISHES_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishes." });
    }
  });
  app.post("/api/wishes/:id/like", async (req, res) => {
    try {
      const data = await import_promises.default.readFile(WISHES_FILE, "utf-8");
      const wishes = JSON.parse(data);
      const wishIndex = wishes.findIndex((w) => w.id === req.params.id);
      if (wishIndex === -1) {
        return res.status(404).json({ error: "Wish not found" });
      }
      wishes[wishIndex].likes = (wishes[wishIndex].likes || 0) + 1;
      await import_promises.default.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2));
      res.json(wishes[wishIndex]);
    } catch (error) {
      res.status(500).json({ error: "Failed to like wish." });
    }
  });
  app.post("/api/wishes", async (req, res) => {
    try {
      const { name, country, message } = req.body;
      if (!name || !country || !message) return res.status(400).json({ error: "Missing fields" });
      const data = await import_promises.default.readFile(WISHES_FILE, "utf-8");
      const wishes = JSON.parse(data);
      const newWish = { id: Date.now().toString(), name, country, message, createdAt: (/* @__PURE__ */ new Date()).toISOString(), likes: 0 };
      wishes.unshift(newWish);
      await import_promises.default.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2));
      res.json(newWish);
    } catch (error) {
      res.status(500).json({ error: "Failed to save wish." });
    }
  });
  app.post("/api/sync-social", async (req, res) => {
    try {
      const fbToken = process.env.FACEBOOK_ACCESS_TOKEN;
      const fbPostId = process.env.FACEBOOK_POST_ID;
      const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      const igMediaId = process.env.INSTAGRAM_MEDIA_ID;
      if (!fbToken && !igToken) {
        return res.status(400).json({
          error: "Social integration not configured. Please set FACEBOOK_ACCESS_TOKEN or INSTAGRAM_ACCESS_TOKEN in your environment variables. You must create a Meta Developer App and generate access tokens to use this feature."
        });
      }
      const data = await import_promises.default.readFile(WISHES_FILE, "utf-8");
      const wishes = JSON.parse(data);
      let newWishesCount = 0;
      if (fbToken && fbPostId) {
        try {
          const fbResponse = await fetch(`https://graph.facebook.com/v19.0/${fbPostId}/comments?access_token=${fbToken}`);
          if (fbResponse.ok) {
            const fbData = await fbResponse.json();
            for (const comment of fbData.data || []) {
              if (!wishes.find((w) => w.id === `fb_${comment.id}`)) {
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
      if (igToken && igMediaId) {
        try {
          const igResponse = await fetch(`https://graph.facebook.com/v19.0/${igMediaId}/comments?access_token=${igToken}`);
          if (igResponse.ok) {
            const igData = await igResponse.json();
            for (const comment of igData.data || []) {
              if (!wishes.find((w) => w.id === `ig_${comment.id}`)) {
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
      await import_promises.default.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2));
      res.json({ success: true, message: `Synced ${newWishesCount} new comments.` });
    } catch (error) {
      console.error("Social sync error:", error);
      res.status(500).json({ error: "Failed to sync social comments." });
    }
  });
  app.post("/api/generate-tribute", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const { name, country, tone } = req.body;
      const prompt = `Write a short, highly elegant and luxurious 50th Golden Jubilee birthday tribute for Her Majesty The Queen.
      The tribute should be signed by ${name} from ${country}.
      Tone: ${tone || "respectful, royal, and poetic"}.
      Keep it under 3 sentences. No placeholders. Just the message.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ message: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate tribute." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
