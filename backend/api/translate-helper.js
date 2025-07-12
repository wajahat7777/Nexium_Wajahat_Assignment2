const axios = require('axios');

async function translateToUrdu(text) {
  console.log('🌍 Starting Urdu translation...');
  
  // Truncate text to prevent "QUERY LENGTH LIMIT EXCEEDED" error
  // Most free translation services have 500 character limits
  const truncatedText = text.length > 450 ? text.slice(0, 450) + '...' : text;
  console.log(`📝 Text length: ${text.length}, truncated to: ${truncatedText.length}`);
  
  // Priority: LibreTranslate (with API key support)
  try {
    console.log('🔄 Trying LibreTranslate...');
    const response = await axios.post(
      'https://libretranslate.de/translate',
      {
        q: truncatedText,
        source: 'en',
        target: 'ur',
        api_key: 'free' // Replace with your key if available
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    if (response.data && response.data.translatedText) {
      console.log('✅ LibreTranslate successful');
      return response.data.translatedText;
    }
  } catch (error) {
    console.log('❌ LibreTranslate failed:', error.message);
  }

  // Fallback: MyMemory (free, no key required)
  try {
    console.log('🔄 Trying MyMemory...');
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncatedText)}&langpair=en|ur`,
      { timeout: 30000 }
    );
    
    if (response.data && response.data.responseData && response.data.responseData.translatedText) {
      console.log('✅ MyMemory successful');
      return response.data.responseData.translatedText;
    }
  } catch (error) {
    console.log('❌ MyMemory failed:', error.message);
  }

  // Final fallback: Yandex (free tier)
  try {
    console.log('🔄 Trying Yandex...');
    const response = await axios.post(
      'https://translate.yandex.net/api/v1.5/tr.json/translate',
      null,
      {
        params: {
          key: 'free', // Replace with your key
          text: truncatedText,
          lang: 'en-ur',
          format: 'plain'
        },
        timeout: 30000
      }
    );
    
    if (response.data && response.data.text && response.data.text[0]) {
      console.log('✅ Yandex successful');
      return response.data.text[0];
    }
  } catch (error) {
    console.log('❌ Yandex failed:', error.message);
  }

  // Ultimate fallback: Return original text with note
  console.log('❌ All translation services failed, returning original text');
  return `${truncatedText} (ترجمہ دستیاب نہیں - Translation not available)`;
}

module.exports = translateToUrdu; 