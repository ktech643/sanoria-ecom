import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { user: req.session.user || null });
});

router.get('/qr', (req, res) => {
  res.render('qr');
});

router.get('/admin', (req, res) => {
  res.render('admin/login');
});

export default router;