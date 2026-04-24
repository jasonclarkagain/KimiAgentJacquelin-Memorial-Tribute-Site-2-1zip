import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const META_FILE = path.join(UPLOADS_DIR, 'metadata.json');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(META_FILE)) fs.writeFileSync(META_FILE, '[]');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|mov|avi|webm|quicktime)/;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  },
});

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeMeta(data: unknown[]) {
  fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/media', (_req, res) => {
  const meta = readMeta();
  res.json(meta);
});

app.post('/api/upload', upload.array('files', 20), (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { uploader = 'Anonymous', caption = '' } = req.body;

  const meta = readMeta();
  const newItems = (files || []).map((file) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    filename: file.filename,
    originalName: file.originalname,
    type: file.mimetype.startsWith('video') ? 'video' : 'image',
    url: `/uploads/${file.filename}`,
    uploader,
    caption,
    uploadedAt: new Date().toISOString(),
    size: file.size,
  }));

  writeMeta([...newItems, ...meta]);
  res.json({ success: true, items: newItems });
});

app.post('/api/text', (req, res) => {
  const { uploader = 'Anonymous', content = '', caption = '' } = req.body;
  if (!content.trim()) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const meta = readMeta();
  const newItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: 'text',
    content,
    uploader,
    caption,
    uploadedAt: new Date().toISOString(),
  };

  writeMeta([newItem, ...meta]);
  res.json({ success: true, item: newItem });
});

app.delete('/api/media/:id', (req, res) => {
  const meta = readMeta();
  const item = meta.find((m: { id: string }) => m.id === req.params.id);
  if (item && item.filename) {
    const filePath = path.join(UPLOADS_DIR, item.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  writeMeta(meta.filter((m: { id: string }) => m.id !== req.params.id));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
