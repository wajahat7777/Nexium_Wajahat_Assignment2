console.log('STARTING BACKEND INDEX.JS');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const Blog = require('./models/Blog');
const summarise = require('./api/summarise');
const translateToUrdu = require('./api/translate');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Configuration
const MONGODB_URI = "mongodb+srv://wajahat:hello@cluster0.ts6enj7.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0";

// Supabase Configuration
const SUPABASE_URL = 'https://vkfqoiuukmrnmvckexmk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZnFvaXV1a21ybm12Y2tleG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzE4NjksImV4cCI6MjA2NzEwNzg2OX0.dZHF_azyQMHMHE831cdUnTHzc1jLWG0zqDZtghij0b4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check routes
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    routes: ['GET /test', 'POST /summarise', 'POST /api/translate']
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API routing is working!',
    postRoute: 'POST /summarise is available'
  });
});

// Main summarizer route
app.post('/summarise', async (req, res) => {
  console.log('=== POST /summarise endpoint hit ===');
  console.log('Request body:', req.body);
  
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
      details: err.message 
    });
  }
});

// Translation route
app.post('/api/translate', (req, res) => {
  console.log('=== POST /api/translate endpoint hit ===');
  console.log('Request body:', req.body);
  
  const { text } = req.body;
  if (!text) {
    console.log('❌ No text provided');
    return res.status(400).json({ error: 'Text is required' });
  }
  
  translateToUrdu(text)
    .then(urduSummary => {
      console.log('✅ Translation completed');
      res.json({ urduSummary });
    })
    .catch(err => {
      console.error('❌ Translation error:', err.message);
      res.status(500).json({ error: 'Failed to translate text', details: err.message });
    });
});

// Supabase test route
app.post('/utils/test-supabase', async (req, res) => {
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
});

// Initialize Supabase and start server
async function initializeSupabase() {
  try {
    const { data, error } = await supabase.from('summaries').select('*').limit(1);
    if (error && error.code === '42P01') {
      console.log('Supabase connected, but table does not exist. Creating table...');
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql: `CREATE TABLE summaries (
          id serial PRIMARY KEY,
          url text,
          summary text,
          urdu_summary text
        );`
      });
      if (createError) {
        console.error('Failed to create summaries table:', createError.message);
      } else {
        console.log('Summaries table created successfully.');
      }
    } else if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connected and summaries table exists.');
    }
  } catch (err) {
    console.error('Supabase connection check failed:', err.message);
  }
}

// For Vercel deployment
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  initializeSupabase().then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
} 