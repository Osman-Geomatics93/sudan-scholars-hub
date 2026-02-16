# PicoClaw - Sudan Scholars Hub Telegram Bot

A Telegram bot powered by [PicoClaw](https://github.com/sipeed/picoclaw) that gives students access to the Study Hub directly from Telegram.

## Features

- Search scholarships by country, level, funding type, and field
- Review flashcards with spoiler-hidden answers
- Take quick quizzes from the community question bank
- Find approved study materials
- View the student leaderboard
- Get daily study tips (English/Arabic)
- Check platform statistics

## Prerequisites

- Docker and Docker Compose
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- A free Groq API key from [console.groq.com](https://console.groq.com)
- The Next.js app running with `BOT_API_KEY` configured

## Setup

1. **Create your Telegram bot:**
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot` and follow the prompts
   - Copy the bot token

2. **Get a Groq API key:**
   - Sign up at [console.groq.com](https://console.groq.com)
   - Create a new API key (free tier is sufficient)

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   - `TELEGRAM_BOT_TOKEN` — from BotFather
   - `BOT_API_KEY` — must match the `BOT_API_KEY` in your Next.js `.env`
   - `GROQ_API_KEY` — from Groq console
   - `STUDY_HUB_BASE_URL` — your deployed Next.js app URL (no trailing slash)

4. **Generate a shared API key** (if you haven't already):
   ```bash
   openssl rand -hex 32
   ```
   Use this value for `BOT_API_KEY` in both the Next.js app and PicoClaw `.env` files.

5. **Start the bot:**
   ```bash
   docker compose up -d
   ```

6. **Check logs:**
   ```bash
   docker compose logs -f
   ```

## Architecture

```
Student on Telegram  →  PicoClaw (Docker)  →  /api/bot/* (Next.js)  →  PostgreSQL
                     ←  formatted response  ←  JSON { text, count }  ←
```

PicoClaw uses its built-in `web_fetch` tool to call the bot API endpoints. The LLM reads `IDENTITY.md` and `TOOLS.md` to understand which endpoints to call based on user messages.

## Bot Commands

Students can ask naturally in English or Arabic:

| Question | API Called |
|----------|-----------|
| "Find scholarships in Germany" | `/api/bot/scholarships?search=Germany` |
| "Show me flashcards about biology" | `/api/bot/flashcards?subject=biology` |
| "Quiz me on physics" | `/api/bot/quiz?subject=physics` |
| "Find calculus notes" | `/api/bot/materials?search=calculus` |
| "Show the leaderboard" | `/api/bot/leaderboard` |
| "Give me a study tip" | `/api/bot/study-tips` |
| "How many users?" | `/api/bot/stats` |

## Troubleshooting

- **Bot not responding:** Check `docker compose logs` for errors
- **401 errors:** Verify `BOT_API_KEY` matches between Next.js and PicoClaw
- **429 errors:** Rate limit hit (30 requests/minute). Wait and retry.
- **Connection errors:** Verify `STUDY_HUB_BASE_URL` is correct and accessible from Docker
