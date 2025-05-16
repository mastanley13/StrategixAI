
# StrategixAI Website & Backend Development Roadmap
*Version 0.1 — generated 2025-05-16*

---

## 1. Purpose & Scope
This roadmap turns the **AiTechVision** Replit export into a **production‑ready StrategixAI site**:

| Goal | Outcome |
|------|---------|
| **Hosting** | Front‑end + back‑end deployed to **Vercel** |
| **Blog** | Pull Go High Level (GHL) blog posts via RSS and render on-site for SEO |
| **Services** | Intake forms, booking endpoints, CRM & email hooks |
| **Admin** | Secure dashboard to manage leads & bookings |
| **Database** | Persistent storage via **PostgreSQL + Drizzle ORM** (Neon cloud) |

---

## 2. Source Import Checklist
| Status | Step |
|:-----:|------|
| 🔲 | Unzip *AiTechVision.zip* into local workspace |
| 🔲 | `npm install` (root) |
| 🔲 | **Windows fix** → `npm i -D cross-env` and edit `package.json`:<br>`"dev": "cross-env NODE_ENV=development tsx server/index.ts"` |
| 🔲 | Commit initial codebase to **GitHub** (`main` branch) |

---

## 3. Tech Stack
| Layer | Tooling | Notes |
|-------|---------|-------|
| Front‑end | React 18 + Vite + Tailwind CSS | May migrate blog pages to **Next.js** for built‑in SSG/ISR |
| Back‑end | Node 18, Express, TypeScript (`tsx`) | Lives under `/server` |
| ORM | **Drizzle** ↔ PostgreSQL | Schema already in `/shared/schema.ts` |
| Auth (admin) | Firebase Auth **or** clerk.dev *(TBD)* | Minimal for v1: email‑link login |
| Hosting | **Vercel** | Static + Serverless; enables ISR caching |
| CRM | **Go High Level API** | Create contacts & appointments |
| Email | SendGrid API | Transactional confirmations |

---

## 4. Environment Variables
Create `.env.local` (not committed):

```
DATABASE_URL=
GHL_API_KEY=
SENDGRID_API_KEY=
FIREBASE_SERVICE_ACCOUNT_JSON='{}'
RSS_FEED_URL=https://rss-link.com/feed/8lQAYS7QatKYV3ENYdl1?blogId=...
```

---

## 5. Local Dev
```bash
# 1. Install deps
npm install

# 2. Run DB migrations (Postgres):
npm run db:push   # or drizzle-kit push

# 3. Start dev servers
npm run dev       # Express + Vite
```

---

## 6. Task Matrix

| Section | Task | Owner | Status |
|---------|------|-------|--------|
| **Repo bootstrap** | Import zip, add cross‑env, commit to Git | Cursor | 🔲 |
| **DB** | Provision Neon Postgres; set `DATABASE_URL`; run migrations | Cursor | 🔲 |
| **API** | Refactor `/api/contact` → `/api/intake` with DB + GHL push | Cursor | 🔲 |
| **Booking** | `/api/book` endpoint + Google Calendar or Calendly embed | Cursor | 🔲 |
| **Blog Service** | RSS fetcher (rss‑parser) → JSON | Cursor | 🔲 |
| **Blog Pages** | `/blog` index + `/blog/[slug]` detail (SSG, revalidate 3600s) | Cursor | 🔲 |
| **Admin UI** | `/admin` dashboard (auth‑protected) | Cursor | 🔲 |
| **Email** | SendGrid helper; confirmation + internal alert | Cursor | 🔲 |
| **Deploy** | Vercel project, env vars, test production URL | Cursor | 🔲 |
| **QA** | Lighthouse + manual checks, SEO meta, 404 routes | Cursor | 🔲 |

*(update the table as tasks move to ✅)*

---

## 7. Working Agreement for **Cursor Agent**
1. **Always open this roadmap first** in each session.  
2. Update **Task Matrix** after completing or scoping work.  
3. Use *feature branches* → PR → merge to `main`.  
4. Commit messages: `feat(blog): add RSS parser`, `fix(api): validate email`, etc.  
5. Keep pull‑request summaries short + link to roadmap tasks.  
6. Ask for clarification if any requirement is unclear **before** coding.

---

## 8. Known Roadblocks & Mitigations
| Issue | Mitigation |
|-------|------------|
| `NODE_ENV` not recognized on Windows | Use **cross-env** |
| CORS for client RSS fetch | Fetch RSS server‑side only |
| Large RSS (>50 posts) | Limit to 25 items via GHL settings |
| Vercel cold start | Use ISR (`revalidate`) + CDN cache headers |
| Secret keys leak | Store only in Vercel env vars; never commit |

---

## 9. Stretch Goals
- Migrate entire repo to **Next.js** for unified framework.
- Replace Calendly with self‑hosted booking component.
- Add social‑sharing OpenGraph images via `@vercel/og`.
- Unit tests with Vitest & supertest.
- GitHub Actions CI (lint + test).

---

## 10. References
- GHL API docs  
- Drizzle ORM docs  
- Vercel ISR guide  
- rss‑parser NPM  
- DOMPurify (sanitize HTML)

---

*End of roadmap — keep this file up‑to‑date!*  
