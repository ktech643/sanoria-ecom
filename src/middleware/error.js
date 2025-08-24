// Generic error handling middleware
// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    res.status(status).json({ error: err.message || 'Server error' });
  } else {
    res.status(status).render('home', { title: 'Error', error: err.message });
  }
};