// everything ends up here via next(err). keep all 4 args or express won't treat it as an error handler.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}

function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

module.exports = { errorHandler, notFound };
