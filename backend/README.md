# Blog Summariser Backend

A Node.js backend that scrapes blog content, generates AI summaries using free AI services, and translates them to Urdu using free translation APIs.

## Features

- ✅ **Free AI summarization** using Hugging Face and Cohere
- ✅ **Free Urdu translation** using LibreTranslate and MyMemory
- ✅ Web scraping with Cheerio
- ✅ MongoDB storage for full scraped text
- ✅ Supabase storage for summaries and translations
- ✅ Comprehensive error handling and fallbacks
- ✅ **100% Free** - No paid API keys required!

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Optional)

Create a `.env` file in the backend directory. **All services work without API keys!**

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Optional: Free API Keys (for better performance)
HUGGING_FACE_API_KEY=your_hugging_face_api_key
COHERE_API_KEY=your_cohere_api_key
YANDEX_TRANSLATE_API_KEY=your_yandex_api_key

# Server Configuration
PORT=4000
NODE_ENV=development
```

### 3. Free API Keys Setup (Optional)

#### Hugging Face API Key (Free)
1. Go to [Hugging Face](https://huggingface.co/)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token
5. Add to your `.env` file

#### Cohere API Key (Free Tier)
1. Go to [Cohere](https://cohere.ai/)
2. Sign up for free account
3. Get your API key from dashboard
4. Add to your `.env` file

#### Yandex Translate API Key (Free)
1. Go to [Yandex Cloud](https://cloud.yandex.com/)
2. Create account and get API key
3. Add to your `.env` file

### 4. Run the Server

```bash
node index.js
```

## Free AI Services Used

### Summarization (in order of preference):
1. **Hugging Face** - Completely free, no API key required
2. **Cohere** - 5 requests/minute free
3. **Basic fallback** - Simple text truncation

### Translation (in order of preference):
1. **LibreTranslate** - Completely free, no API key required
2. **MyMemory** - 1000 words/day free, no API key required
3. **Yandex** - 10,000 characters/day free (requires API key)
4. **Basic fallback** - Dictionary-based translation

## API Endpoints

- `GET /test` - Health check
- `GET /api/test` - API health check
- `POST /summarise` - Main summarizer endpoint
- `POST /api/summariser` - Alternative summarizer endpoint
- `POST /api/translate` - Translation endpoint

## Data Storage

- **MongoDB**: Stores full scraped blog text
- **Supabase**: Stores AI-generated summaries and Urdu translations

## Error Handling

The application includes comprehensive error handling:
- Multiple free API fallbacks
- Network timeouts are handled gracefully
- Invalid URLs are caught and reported
- Database errors don't break the main flow
- Always provides some result, even if APIs fail

## Cost

**$0 - Completely Free!** 🎉

- All services work without API keys
- Optional API keys improve performance but aren't required
- No credit card or billing setup needed
- Perfect for development and small projects

## Performance

- **Without API keys**: Basic summarization and translation
- **With API keys**: Professional AI-powered results
- **Fallback system**: Always provides some result
- **Multiple providers**: Redundancy ensures reliability 