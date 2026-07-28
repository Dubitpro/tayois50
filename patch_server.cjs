const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

const imports = `import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";`;

server = server.replace('import fs from "fs/promises";', `import fs from "fs/promises";\n${imports}`);

const uploadSetup = `
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
    const fileUrl = \`/uploads/\${req.file.filename}\`;
    res.json({ url: fileUrl });
  });
`;

server = server.replace('app.use(express.json());', `app.use(express.json());\n${uploadSetup}`);

fs.writeFileSync('server.ts', server);
