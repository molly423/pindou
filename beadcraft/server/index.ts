import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireUser } from './auth';
import { getSupabaseAdmin } from './supabase';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/me', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    res.json({ userId });
  } catch (e) {
    next(e);
  }
});

app.get('/api/profile', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const { data, error } = await admin
      .from('profiles')
      .select('user_id,name,gender,avatar,bio,updated_at,created_at')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;

    res.json({
      profile: data
        ? { name: data.name, gender: data.gender, avatar: data.avatar, bio: data.bio }
        : null,
    });
  } catch (e) {
    next(e);
  }
});

app.put('/api/profile', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const name = String(req.body?.name ?? '').slice(0, 80);
    const gender = req.body?.gender;
    const avatar = String(req.body?.avatar ?? '').slice(0, 500);
    const bio = String(req.body?.bio ?? '').slice(0, 200);

    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender' });
    }

    const { error } = await admin.from('profiles').upsert(
      {
        user_id: userId,
        name,
        gender,
        avatar,
        bio,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    if (error) throw error;

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

app.get('/api/projects', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const { data, error } = await admin
      .from('projects')
      .select('id,title,width,height,grid,updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;

    res.json({
      projects: (data ?? []).map((p: any) => ({
        id: p.id,
        title: p.title,
        width: p.width,
        height: p.height,
        grid: p.grid,
        updatedAt: new Date(p.updated_at).getTime(),
      })),
    });
  } catch (e) {
    next(e);
  }
});

app.put('/api/projects/:id', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const id = String(req.params.id);
    const title = String(req.body?.title ?? '').slice(0, 120);
    const width = Number(req.body?.width);
    const height = Number(req.body?.height);
    const grid = req.body?.grid;

    if (!id) return res.status(400).json({ error: 'Missing id' });
    if (!title) return res.status(400).json({ error: 'Missing title' });
    if (!Number.isFinite(width) || width < 1 || width > 64) return res.status(400).json({ error: 'Invalid width' });
    if (!Number.isFinite(height) || height < 1 || height > 64) return res.status(400).json({ error: 'Invalid height' });
    if (!Array.isArray(grid)) return res.status(400).json({ error: 'Invalid grid' });

    const { error } = await admin.from('projects').upsert(
      {
        id,
        user_id: userId,
        title,
        width,
        height,
        grid,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) throw error;

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

app.delete('/api/projects', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const ids = req.body?.ids;
    if (!Array.isArray(ids) || ids.some((x: any) => typeof x !== 'string')) {
      return res.status(400).json({ error: 'Invalid ids' });
    }

    const { error } = await admin.from('projects').delete().eq('user_id', userId).in('id', ids);
    if (error) throw error;

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

app.get('/api/likes', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const { data, error } = await admin.from('pattern_likes').select('pattern_id').eq('user_id', userId);
    if (error) throw error;

    res.json({ likedPatternIds: (data ?? []).map((r: any) => r.pattern_id) });
  } catch (e) {
    next(e);
  }
});

app.post('/api/likes/toggle', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const patternId = String(req.body?.patternId ?? '');
    if (!patternId) return res.status(400).json({ error: 'Missing patternId' });

    const { data: existing, error: selErr } = await admin
      .from('pattern_likes')
      .select('pattern_id')
      .eq('user_id', userId)
      .eq('pattern_id', patternId)
      .maybeSingle();
    if (selErr) throw selErr;

    if (existing) {
      const { error } = await admin
        .from('pattern_likes')
        .delete()
        .eq('user_id', userId)
        .eq('pattern_id', patternId);
      if (error) throw error;
      return res.json({ liked: false });
    }

    const { error } = await admin.from('pattern_likes').insert({ user_id: userId, pattern_id: patternId });
    if (error) throw error;

    res.json({ liked: true });
  } catch (e) {
    next(e);
  }
});

app.get('/api/following', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const { data, error } = await admin.from('following').select('author_name').eq('user_id', userId);
    if (error) throw error;

    res.json({ followedAuthors: (data ?? []).map((r: any) => r.author_name) });
  } catch (e) {
    next(e);
  }
});

app.post('/api/following/toggle', async (req, res, next) => {
  try {
    const userId = await requireUser(req);
    const admin = getSupabaseAdmin();

    const authorName = String(req.body?.authorName ?? '');
    if (!authorName) return res.status(400).json({ error: 'Missing authorName' });

    const { data: existing, error: selErr } = await admin
      .from('following')
      .select('author_name')
      .eq('user_id', userId)
      .eq('author_name', authorName)
      .maybeSingle();
    if (selErr) throw selErr;

    if (existing) {
      const { error } = await admin
        .from('following')
        .delete()
        .eq('user_id', userId)
        .eq('author_name', authorName);
      if (error) throw error;
      return res.json({ following: false });
    }

    const { error } = await admin.from('following').insert({ user_id: userId, author_name: authorName });
    if (error) throw error;

    res.json({ following: true });
  } catch (e) {
    next(e);
  }
});

// Basic error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = typeof err?.status === 'number' ? err.status : 500;
  res.status(status).json({ error: err?.message ?? 'Unknown error' });
});

// Serve frontend in production (after `vite build`)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const port = Number(process.env.PORT ?? 3001);
app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

