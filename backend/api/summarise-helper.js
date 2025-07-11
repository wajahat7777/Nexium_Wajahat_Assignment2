async function summarise(text) {
  console.log('🤖 Starting summarization...');
  // Extract the first 4-6 sentences as the summary
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [];
  let summary = '';
  if (sentences.length >= 6) {
    summary = sentences.slice(0, 6).join(' ').trim();
  } else if (sentences.length >= 4) {
    summary = sentences.slice(0, 4).join(' ').trim();
  } else if (sentences.length > 0) {
    summary = sentences.join(' ').trim();
  } else {
    summary = text.slice(0, 400) + (text.length > 400 ? '...' : '');
  }
  console.log('✅ 4-6 sentence summary generated');
  return summary;
}

module.exports = summarise; 