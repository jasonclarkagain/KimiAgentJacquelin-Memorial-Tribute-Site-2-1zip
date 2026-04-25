import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const isProd = process.env.NODE_ENV === 'production';

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const META_FILE = path.join(UPLOADS_DIR, 'metadata.json');
const SUBS_FILE = path.join(UPLOADS_DIR, 'subscribers.json');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(META_FILE)) fs.writeFileSync(META_FILE, '[]');
if (!fs.existsSync(SUBS_FILE)) fs.writeFileSync(SUBS_FILE, '[]');

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

function readSubscribers(): { email: string; name: string; subscribedAt: string }[] {
  try {
    return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeSubscribers(data: unknown[]) {
  fs.writeFileSync(SUBS_FILE, JSON.stringify(data, null, 2));
}

async function getResendClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !xReplitToken) return null;

  try {
    const data = await fetch(
      `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=resend`,
      {
        headers: {
          Accept: 'application/json',
          'X-Replit-Token': xReplitToken,
        },
      }
    ).then((r) => r.json()).then((d) => d.items?.[0]);

    if (!data?.settings?.api_key) return null;
    return { client: new Resend(data.settings.api_key), fromEmail: data.settings.from_email };
  } catch {
    return null;
  }
}

async function notifySubscribers(subject: string, html: string) {
  const subscribers = readSubscribers();
  if (subscribers.length === 0) return;

  const resend = await getResendClient();
  if (!resend) {
    console.log('Resend not configured — skipping notifications');
    return;
  }

  const from = resend.fromEmail || 'onboarding@resend.dev';

  for (const sub of subscribers) {
    try {
      await resend.client.emails.send({
        from,
        to: sub.email,
        subject,
        html,
      });
    } catch (err) {
      console.error(`Failed to notify ${sub.email}:`, err);
    }
  }
}

function buildEmailHtml(heading: string, body: string, uploaderName: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1A1A1A; padding: 40px 24px;">
      <p style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #C47A1E; margin-bottom: 8px;">In Memory Of</p>
      <h1 style="font-size: 28px; font-weight: normal; margin: 0 0 4px;">Jacquelin Anne Hellenberg</h1>
      <p style="font-size: 13px; color: #888; margin: 0 0 32px;">1965 — 2025</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 32px;" />
      <h2 style="font-size: 18px; font-weight: normal; margin: 0 0 12px;">${heading}</h2>
      <p style="font-size: 15px; line-height: 1.7; color: #444; margin: 0 0 24px;">${body}</p>
      <p style="font-size: 13px; color: #888; margin: 0 0 32px;">Shared by <strong>${uploaderName}</strong></p>
      <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 24px;" />
      <p style="font-size: 11px; color: #bbb; text-align: center;">
        You are receiving this because you subscribed to updates for Jackie's memorial site.<br/>
        To unsubscribe, reply to this email with "unsubscribe" in the subject.
      </p>
    </div>
  `;
}

app.get('/api/media', (_req, res) => {
  const meta = readMeta();
  res.json(meta);
});

app.post('/api/upload', upload.array('files', 20), async (req, res) => {
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

  const isVideo = newItems.some((i) => i.type === 'video');
  const kind = isVideo ? 'video' : 'photo';
  const count = newItems.length;
  const subject = `New ${count > 1 ? `${count} ${kind}s` : kind} added to Jackie's memorial`;
  const body = caption
    ? `${uploader} added ${count > 1 ? `${count} files` : `a ${kind}`} with the note: "${caption}"`
    : `${uploader} added ${count > 1 ? `${count} files` : `a new ${kind}`} to Jackie's memorial page.`;

  notifySubscribers(subject, buildEmailHtml(`New ${kind}${count > 1 ? 's' : ''} added`, body, uploader));
});

app.post('/api/text', async (req, res) => {
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

  const subject = `A new memory was shared on Jackie's memorial`;
  const preview = content.length > 200 ? content.slice(0, 200) + '…' : content;
  notifySubscribers(
    subject,
    buildEmailHtml('A new memory was shared', preview, uploader)
  );
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

app.post('/api/subscribe', (req, res) => {
  const { email, name = '' } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Valid email required' });
    return;
  }

  const subs = readSubscribers();
  if (subs.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    res.json({ success: true, already: true });
    return;
  }

  subs.push({ email, name, subscribedAt: new Date().toISOString() });
  writeSubscribers(subs);
  res.json({ success: true });
});

app.delete('/api/subscribe', (req, res) => {
  const { email } = req.body;
  const subs = readSubscribers();
  writeSubscribers(subs.filter((s) => s.email.toLowerCase() !== email?.toLowerCase()));
  res.json({ success: true });
});

// Serve built frontend in production
if (isProd) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.use((_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
});
