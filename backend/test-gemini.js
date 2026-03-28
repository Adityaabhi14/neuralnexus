// Run this with: node test-gemini.js
// It will list all models available to your API key

const API_KEY = 'AIzaSyB9Toc8hkR-rCpOsUUrdp5FGYTWLkbc52M';

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error('❌ API Key Error:', data.error);
    console.log('\n→ Fix: Go to https://aistudio.google.com/app/apikey and generate a NEW key.');
    return;
  }

  if (data.models && data.models.length > 0) {
    console.log('✅ API Key works! Available models:');
    data.models.forEach(m => {
      const supportsGenerate = m.supportedGenerationMethods?.includes('generateContent');
      if (supportsGenerate) {
        console.log(`  ✓ ${m.name}`);
      }
    });
  } else {
    console.log('No models returned. Key may not have Gemini API access.');
  }
}

listModels();
