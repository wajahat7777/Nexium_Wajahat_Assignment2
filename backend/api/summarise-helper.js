const axios = require('axios');

async function summarise(text) {
  console.log('🤖 Starting summarization...');
  
  // Priority: Hugging Face (with API key)
  try {
    console.log('🔄 Trying Hugging Face...');
    console.log('🔑 API Key exists:', !!process.env.HUGGINGFACE_API_KEY);
    console.log('🔑 API Key length:', process.env.HUGGINGFACE_API_KEY ? process.env.HUGGINGFACE_API_KEY.length : 0);
    console.log('🔑 API Key starts with:', process.env.HUGGINGFACE_API_KEY ? process.env.HUGGINGFACE_API_KEY.substring(0, 10) + '...' : 'undefined');
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text },
      {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data && response.data[0] && response.data[0].summary_text) {
      console.log('✅ Hugging Face summary successful');
      return response.data[0].summary_text;
    }
  } catch (error) {
    console.log('❌ Hugging Face failed:', error.message);
  }

  // Fallback: Cohere (free tier)
  try {
    console.log('🔄 Trying Cohere...');
    const response = await axios.post(
      'https://api.cohere.ai/v1/summarize',
      {
        text: text,
        length: 'medium',
        format: 'paragraph'
      },
      {
        headers: {
          'Authorization': 'Bearer free', // Free tier
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data && response.data.summary) {
      console.log('✅ Cohere summary successful');
      return response.data.summary;
    }
  } catch (error) {
    console.log('❌ Cohere failed:', error.message);
  }

  // Final fallback: Basic summarization      
  console.log('🔄 Using basic summarization...');
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const summary = sentences.slice(0, 3).join('. ') + '.';
  
  console.log('✅ Basic summary generated');
  return summary;
}

module.exports = summarise; 