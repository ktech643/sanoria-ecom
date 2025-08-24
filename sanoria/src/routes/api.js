import express from 'express';
import { getDb } from '../db/index.js';
import bcrypt from 'bcryptjs';
import qrcode from 'qrcode';

const router = express.Router();

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    return res.json({ ok: true });
  });
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.post('/auth/code', (req, res) => {
  const { purpose } = req.body;
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'Not logged in' });
  const db = getDb();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  db.run('INSERT INTO verification_codes (user_id, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [user.id, code, purpose || 'generic', expires], (e) => {
    if (e) return res.status(500).json({ error: 'Failed' });
    res.json({ ok: true, code });
  });
});

router.post('/auth/verify', (req, res) => {
  const { code, purpose } = req.body;
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'Not logged in' });
  const db = getDb();
  db.get('SELECT * FROM verification_codes WHERE user_id = ? AND code = ? AND purpose = ? AND expires_at > datetime("now") ORDER BY id DESC', [user.id, code, purpose || 'generic'], (e, row) => {
    if (e || !row) return res.status(400).json({ ok: false });
    res.json({ ok: true });
  });
});

router.get('/promotions/qr/:code', async (req, res) => {
  const db = getDb();
  db.get('SELECT * FROM promotions WHERE code = ?', [req.params.code], async (e, promo) => {
    if (e || !promo) return res.status(404).json({ error: 'Not found' });
    const dataUrl = await qrcode.toDataURL(promo.code);
    res.json({ ok: true, qr: dataUrl, promo });
  });
});

router.get('/products/most-viewed', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM products ORDER BY views DESC LIMIT 8', [], (e, rows) => res.json(rows || []));
});

router.get('/blogs/latest', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM blogs ORDER BY created_at DESC LIMIT 3', [], (e, rows) => res.json(rows || []));
});

router.get('/me/history', (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'Not logged in' });
  const db = getDb();
  db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [user.id], (e, orders) => {
    db.all('SELECT * FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?) ORDER BY id DESC', [user.id], (e2, cartItems) => {
      db.all('SELECT * FROM wishlist_items WHERE wishlist_id IN (SELECT id FROM wishlists WHERE user_id = ?) ORDER BY id DESC', [user.id], (e3, wishlistItems) => {
        res.json({ orders: orders || [], cartItems: cartItems || [], wishlistItems: wishlistItems || [] });
      });
    });
  });
});

export default router;