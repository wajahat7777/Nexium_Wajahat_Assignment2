const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration
const SUPABASE_URL = 'https://vkfqoiuukmrnmvckexmk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZnFvaXV1a21ybm12Y2tleG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzE4NjksImV4cCI6MjA2NzEwNzg2OX0.dZHF_azyQMHMHE831cdUnTHzc1jLWG0zqDZtghij0b4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

  console.log('=== POST /utils/test-supabase endpoint hit ===');
  
  try {
    const { data, error } = await supabase.from('summaries').insert([
      {
        url: 'https://example.com',
        summary: 'This is a test summary.',
        urdu_summary: 'یہ ایک ٹیسٹ خلاصہ ہے۔'
      }
    ]);
    if (error) {
      console.error('❌ Supabase test insert error:', error.message);
      return res.status(500).json({ error: error.message });
    }
    console.log('✅ Test summary inserted into Supabase!');
    res.json({ message: 'Test summary inserted into Supabase!', data });
  } catch (err) {
    console.error('❌ Supabase test endpoint error:', err.message);
    res.status(500).json({ error: 'Failed to insert test summary.' });
  }
}; 