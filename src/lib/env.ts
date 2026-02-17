/**
 * Centralized environment variable validation.
 * Use these getters instead of accessing process.env directly.
 * They throw clear errors at call time if a required var is missing.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Add it to your .env file and restart the server.`
    );
  }
  return value;
}

// Auth
export function getGoogleClientId() { return requireEnv('GOOGLE_CLIENT_ID'); }
export function getGoogleClientSecret() { return requireEnv('GOOGLE_CLIENT_SECRET'); }
export function getNextAuthSecret() { return requireEnv('NEXTAUTH_SECRET'); }

// AI services
export function getGroqApiKey() { return requireEnv('GROQ_API_KEY'); }
export function getGeminiApiKey() { return requireEnv('GOOGLE_GEMINI_API_KEY'); }
export function getDeepSeekApiKey() { return requireEnv('DEEPSEEK_API_KEY'); }

// Email
export function getResendApiKey() { return requireEnv('RESEND_API_KEY'); }

// Database
export function getDatabaseUrl() { return requireEnv('DATABASE_URL'); }

// Bot
export function getBotApiKey() { return requireEnv('BOT_API_KEY'); }

// Docling service
export function getDoclingServiceUrl() { return requireEnv('DOCLING_SERVICE_URL'); }
export function getDoclingApiKey() { return requireEnv('DOCLING_API_KEY'); }
