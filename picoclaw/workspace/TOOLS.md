# API Endpoints Reference

Base URL: Use the `STUDY_HUB_BASE_URL` environment variable (e.g., `https://your-app.vercel.app`).

All endpoints require the `X-Bot-API-Key` header (set automatically via config).
All endpoints return JSON: `{ text: string, count: number }`.
The `text` field is pre-formatted for Telegram (Markdown).

---

## 1. Scholarships

**When to use:** User asks about scholarships, opportunities, funding, universities, deadlines.

```
GET {BASE_URL}/api/bot/scholarships?search=&level=&funding=&field=&lang=en&upcoming=true&limit=5
```

| Param | Type | Description |
|-------|------|-------------|
| search | string | Search title, university, country (EN or AR) |
| level | string | BACHELOR, MASTER, PHD (comma-separated) |
| funding | string | FULLY_FUNDED, PARTIALLY_FUNDED (comma-separated) |
| field | string | ENGINEERING, MEDICINE, BUSINESS, ARTS, SCIENCE, LAW, EDUCATION, TECHNOLOGY |
| lang | string | `en` or `ar` (default: en) |
| upcoming | string | `true` to show only future deadlines |
| limit | number | 1-10 (default: 5) |

**Examples:**
- "Find me scholarships in Turkey" → `?search=Turkey&upcoming=true`
- "منح ماجستير ممولة بالكامل" → `?level=MASTER&funding=FULLY_FUNDED&lang=ar`
- "Engineering PhD opportunities" → `?level=PHD&field=ENGINEERING&upcoming=true`

---

## 2. Flashcards

**When to use:** User wants to study with flashcards, review cards, or find decks.

```
GET {BASE_URL}/api/bot/flashcards?action=random&subject=&count=3&deckId=
```

| Param | Type | Description |
|-------|------|-------------|
| action | string | `random` (default), `decks` (list decks), `due` (due for review) |
| subject | string | Filter by subject/topic |
| count | number | 1-10 (default: 3) |
| deckId | string | Specific deck ID (for `due` action or filtering) |

**Examples:**
- "Show me some flashcards" → `?action=random&count=3`
- "Biology flashcard decks" → `?action=decks&subject=biology`
- "Due cards in deck X" → `?action=due&deckId=X`

---

## 3. Quiz

**When to use:** User wants to test knowledge, take a quiz, or practice questions.

```
GET {BASE_URL}/api/bot/quiz?subject=&count=5
```

| Param | Type | Description |
|-------|------|-------------|
| subject | string | Filter by subject |
| count | number | 1-10 (default: 5) |

**Examples:**
- "Quiz me on physics" → `?subject=physics&count=5`
- "Give me 3 random questions" → `?count=3`

---

## 4. Study Materials

**When to use:** User asks for notes, PDFs, study resources, or lecture materials.

```
GET {BASE_URL}/api/bot/materials?search=&type=&limit=5
```

| Param | Type | Description |
|-------|------|-------------|
| search | string | Search title, subject, description |
| type | string | `pdf`, `docx`, `pptx`, `video` |
| limit | number | 1-10 (default: 5) |

**Examples:**
- "Find calculus notes" → `?search=calculus`
- "Video lectures" → `?type=video&limit=5`

---

## 5. Leaderboard

**When to use:** User asks about top students, rankings, points, or competition.

```
GET {BASE_URL}/api/bot/leaderboard?limit=10
```

| Param | Type | Description |
|-------|------|-------------|
| limit | number | 1-20 (default: 10) |

**Examples:**
- "Show the leaderboard" → `?limit=10`
- "Top 5 students" → `?limit=5`

---

## 6. Study Tips

**When to use:** User asks for study advice, motivation, or learning tips.

```
GET {BASE_URL}/api/bot/study-tips?lang=en
```

| Param | Type | Description |
|-------|------|-------------|
| lang | string | `en` or `ar` (default: en) |

**Examples:**
- "Give me a study tip" → `?lang=en`
- "نصيحة للدراسة" → `?lang=ar`

---

## 7. Platform Stats

**When to use:** User asks about the platform size, community numbers, or how many resources exist.

```
GET {BASE_URL}/api/bot/stats
```

No parameters needed.

**Examples:**
- "How big is the platform?" → no params
- "How many scholarships do you have?" → no params
