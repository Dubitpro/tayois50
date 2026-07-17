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
