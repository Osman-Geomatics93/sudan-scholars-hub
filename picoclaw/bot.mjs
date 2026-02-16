/**
 * Sudan Scholars Hub - Telegram Bot
 * Standalone bot using node-telegram-bot-api + Groq LLM
 * Replaces PicoClaw Docker setup with a simple Node.js script
 */

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_API_KEY = process.env.BOT_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const BASE_URL = process.env.STUDY_HUB_BASE_URL;

if (!TELEGRAM_TOKEN || !BOT_API_KEY || !GROQ_API_KEY || !BASE_URL) {
  console.error('Missing required env vars. Check picoclaw/.env');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
console.log('🤖 Sudan Scholars Hub Bot started (polling)...');
console.log(`📡 API: ${BASE_URL}`);

// --- Groq LLM for intent detection ---
async function detectIntent(userMessage) {
  const systemPrompt = `You are an intent classifier for a scholarship bot. Given a user message, return a JSON object with:
- "endpoint": one of "scholarships", "flashcards", "quiz", "materials", "leaderboard", "study-tips", "stats", "greeting", "unknown"
- "params": an object of query parameters to pass to the API
- "lang": "en" or "ar" based on the user's language

Parameter rules:
- scholarships: search (string), level (BACHELOR,MASTER,PHD), funding (FULLY_FUNDED,PARTIALLY_FUNDED), field (ENGINEERING,MEDICINE,BUSINESS,ARTS,SCIENCE,LAW,EDUCATION,TECHNOLOGY), upcoming ("true"), limit (1-10)
- flashcards: action ("random","decks","due"), subject (string), count (1-10), deckId (string)
- quiz: subject (string), count (1-10)
- materials: search (string), type ("pdf","docx","pptx","video"), limit (1-10)
- leaderboard: limit (1-20)
- study-tips: lang ("en" or "ar")
- stats: no params

Only return valid JSON. No explanation.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.1,
        max_tokens: 256,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } catch (err) {
    console.error('Groq error:', err.message);
    return { endpoint: 'unknown', params: {}, lang: 'en' };
  }
}

// --- Call bot API ---
async function callBotAPI(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}/api/bot/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  try {
    const res = await fetch(url.toString(), {
      headers: { 'X-Bot-API-Key': BOT_API_KEY },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { text: `❌ API error: ${err.error || res.statusText}`, count: 0 };
    }

    return await res.json();
  } catch (err) {
    console.error(`API call failed (${endpoint}):`, err.message);
    return { text: '❌ Sorry, I couldn\'t reach the server. Please try again.', count: 0 };
  }
}

// --- Greeting response ---
function getGreeting(lang) {
  if (lang === 'ar') {
    return `مرحباً! 👋 أنا مساعد *منصة Sudan Scholars Hub*

يمكنني مساعدتك في:
🎓 البحث عن المنح الدراسية
🃏 مراجعة البطاقات التعليمية
🧠 اختبارات سريعة
📚 مواد دراسية
🏆 لوحة المتصدرين
💡 نصائح للدراسة
📊 إحصائيات المنصة

أرسل لي أي سؤال!`;
  }
  return `Hello! 👋 I'm the *Sudan Scholars Hub* assistant.

I can help you with:
🎓 Search scholarships
🃏 Review flashcards
🧠 Quick quizzes
📚 Study materials
🏆 Leaderboard
💡 Study tips
📊 Platform stats

Just ask me anything!`;
}

// --- Handle messages ---
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // Skip bot commands like /start
  if (text === '/start') {
    return bot.sendMessage(chatId, getGreeting('en'), { parse_mode: 'Markdown' });
  }

  if (text === '/help') {
    return bot.sendMessage(chatId, getGreeting('en'), { parse_mode: 'Markdown' });
  }

  try {
    // Show "typing..." indicator
    bot.sendChatAction(chatId, 'typing');

    // Detect intent using Groq LLM
    const intent = await detectIntent(text);
    console.log(`[${msg.from?.first_name}] "${text}" → ${intent.endpoint}`, intent.params);

    if (intent.endpoint === 'greeting') {
      return bot.sendMessage(chatId, getGreeting(intent.lang || 'en'), { parse_mode: 'Markdown' });
    }

    if (intent.endpoint === 'unknown') {
      const unknownMsg = intent.lang === 'ar'
        ? '🤔 عذراً، لم أفهم طلبك. يمكنني مساعدتك في: المنح، البطاقات التعليمية، الاختبارات، المواد الدراسية، لوحة المتصدرين، ونصائح الدراسة.'
        : '🤔 Sorry, I didn\'t understand. I can help with: scholarships, flashcards, quizzes, study materials, leaderboard, and study tips.';
      return bot.sendMessage(chatId, unknownMsg);
    }

    // Add lang to params if detected as Arabic
    if (intent.lang === 'ar' && ['scholarships', 'study-tips'].includes(intent.endpoint)) {
      intent.params.lang = 'ar';
    }

    // Call the API
    const result = await callBotAPI(intent.endpoint, intent.params);

    // Send response
    await bot.sendMessage(chatId, result.text, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Message handling error:', err);
    bot.sendMessage(chatId, '❌ Something went wrong. Please try again.');
  }
});

// --- Error handling ---
bot.on('polling_error', (err) => {
  console.error('Polling error:', err.code, err.message);
});

console.log('✅ Bot is listening for messages...');
