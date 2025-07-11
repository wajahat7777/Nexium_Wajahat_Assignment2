module.exports = (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    routes: ['GET /test', 'POST /summarise', 'POST /api/translate']
  });
}; 