const translateToUrdu = require('./translate-helper');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('=== POST /api/translate endpoint hit ===');
  console.log('Request body:', req.body);
  
  const { text } = req.body;
  if (!text) {
    console.log('❌ No text provided');
    return res.status(400).json({ error: 'Text is required' });
  }
  
  try {
    const urduSummary = await translateToUrdu(text);
    console.log('✅ Translation completed');
    res.json({ urduSummary });
  } catch (err) {
    console.error('❌ Translation error:', err.message);
    res.status(500).json({ error: 'Failed to translate text', details: err.message });
  }
}; 