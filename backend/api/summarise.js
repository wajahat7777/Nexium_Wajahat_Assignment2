const axios = require('axios');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

// MongoDB Configuration
const MONGODB_URI = "mongodb+srv://wajahat:hello@cluster0.ts6enj7.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0";

// Supabase Configuration
const SUPABASE_URL = 'https://vkfqoiuukmrnmvckexmk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZnFvaXV1a21ybm12Y2tleG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzE4NjksImV4cCI6MjA2NzEwNzg2OX0.dZHF_azyQMHMHE831cdUnTHzc1jLWG0zqDZtghij0b4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Import models and functions
const Blog = require('../models/Blog');
const summarise = require('./summarise-helper');
const translateToUrdu = require('./translate-helper');

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize Supabase table if it doesn't exist
async function initializeSupabase() {
  try {
    const { data, error } = await supabase.from('summaries').select('*').limit(1);
    if (error && error.code === '42P01') {
      console.log('Supabase connected, but table does not exist. Creating table...');
      // Skip table creation for now to avoid errors
      console.log('Table creation skipped for Vercel deployment');
    } else if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connected and summaries table exists.');
    }
  } catch (err) {
    console.error('Supabase connection check failed:', err.message);
  }
}

// Initialize Supabase on module load
initializeSupabase();

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

  console.log('=== POST /summarise endpoint hit ===');
  console.log('Request body:', req.body);
  console.log('Environment check - HUGGINGFACE_API_KEY exists:', !!process.env.HUGGINGFACE_API_KEY);
  
  const { url } = req.body;
  if (!url) {
    console.log('❌ No URL provided');
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log('✅ Processing URL:', url);

  try {
    // Scrape blog text
    console.log('🔍 Fetching URL:', url);
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ Fetched data, length:', data.length);

    const $ = cheerio.load(data);
    const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 2000);
    console.log('✅ Scraped text, length:', text.length);

    if (!text || text.length < 20) {
      console.error('❌ Text too short:', text.length);
      return res.status(422).json({ error: 'Failed to extract meaningful text from the blog.' });
    }

    // Generate summary and translation
    console.log('🤖 Generating summary...');
    const summary = await summarise(text);
    console.log('✅ Summary generated');

    console.log('🌍 Generating Urdu translation...');
    const urduSummary = await translateToUrdu(summary);
    console.log('✅ Urdu translation generated');

    // Save to databases
    console.log('💾 Saving to MongoDB...');
    try {
      const blog = new Blog({ url, fullText: text });
      await blog.save();
      console.log('✅ Full scraped text saved to MongoDB');
    } catch (mongoErr) {
      console.error('❌ MongoDB save error:', mongoErr.message);
    }

    console.log('☁️ Saving to Supabase...');
    try {
      const { error: supabaseError } = await supabase.from('summaries').insert([
        { url, summary, urdu_summary: urduSummary }
      ]);
      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError.message);
      } else {
        console.log('✅ Summary and Urdu translation saved to Supabase');
      }
    } catch (supabaseErr) {
      console.error('❌ Supabase save failed:', supabaseErr.message);
    }

    console.log('🎉 Success! Returning response');
    res.json({ fullText: text, summary, urduSummary });
    
  } catch (err) {
    console.error('❌ Error in /summarise:', err.message);
    console.error('❌ Error stack:', err.stack);
    console.error('❌ Error name:', err.name);
    console.error('❌ Error code:', err.code);
    
    if (err.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timeout - URL took too long to respond' });
    }
    
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'URL not found or inaccessible' });
    }
    
    if (err.code === 'ENOTFOUND') {
      return res.status(404).json({ error: 'Invalid URL or domain not found' });
    }
    
    res.status(500).json({ 
      error: 'Failed to process blog',
      details: err.message,
      stack: err.stack
    });
  }
}; 