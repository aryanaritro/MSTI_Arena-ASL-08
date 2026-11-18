export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid data', errors: error.errors ? Object.values(error.errors).map((item) => item.message) : undefined });
  }
  if (error.status && error.status < 500) {
    return res.status(error.status).json({ message: error.message });
  }
  if (process.env.NODE_ENV !== 'production') console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
}
