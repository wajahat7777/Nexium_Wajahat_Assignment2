async function summarise(text) {
  console.log('🤖 Starting summarization...');
  // Return the entire text as the summary
  const summary = text.trim();
  console.log('✅ Full text returned as summary');
  return summary;
}

module.exports = summarise; 