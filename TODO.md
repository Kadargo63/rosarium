# Rosarium — Feature Backlog

Last updated: 2026-07-07

---

## Priority Order (Recommended Sequence)

| # | Item | Effort | Status |
|---|------|--------|--------|
| 1 | PWA Icons | Tiny | ✅ Done — `src/app/icon.tsx` + `src/app/manifest.ts` |
| 2 | allowedDevOrigins config | Tiny | ✅ Done — `next.config.js` |
| 3 | Photo Gallery (full implementation) | Medium | ✅ Done — nav, log context, lazy load |
| 4 | Share to External Social | Small–Medium | ✅ Done — `ShareButton.tsx`, Web Share API |
| 5 | Supabase Auth | Large | 🔲 Backlog |
| 6 | Club Member Gardens & Photos | Large | 🔲 Blocked by Auth (#5) |
| 7 | Built-in Rosarium Social Feed | Large | 🔲 Blocked by Auth (#5) + Club (#6) |
| 8 | Bloom Prediction / Analytics expansion | Medium | 🔲 Needs more log data |
| 9 | Offline / Service Worker | Medium | 🔲 Backlog |

---

## ✅ Quick Fixes (Do Now)

### PWA Icons Missing
**What:** `icon-192.png` and `icon-512.png` are returning 404. When the app is added to the home screen the OS shows a blank/generic icon.

**Fix:**
- Create two PNG images (rose or "R" logo) at exactly 192×192 and 512×512 pixels
- Place them in `public/icon-192.png` and `public/icon-512.png`
- They are already referenced in `src/app/manifest.ts`

**Effort:** Tiny (image creation only — no code changes)

---

### allowedDevOrigins Warning
**What:** Browser console shows a cross-origin warning when accessing the dev server from your phone (`192.168.0.117`). Will become a hard error in a future Next.js major version.

**Fix:** Add to `next.config.js`:
```js
experimental: {
  allowedDevOrigins: ['192.168.0.117'],
},
```

**Effort:** Tiny (1 line)

---

## 🖼️ In-App Photo Gallery

**What:** View all photos taken for a plant directly within the app — a scrollable gallery on the plant detail page, with lightbox tap-to-expand, date/log context per photo.

**Scope:**
- Plant detail page already has a `PhotoGallery` component stub — needs full implementation
- Pull photos from `rosarium-photos` Supabase storage bucket (already set up)
- Show thumbnail grid, tap to expand full-screen with swipe navigation
- Display log date, notes, bloom stage alongside each photo

**Effort:** Medium (2–3 sessions)

---

## 👥 Club Member Gardens & Photos

**What:** When other club members track their gardens in Rosarium, you can browse their plants and see their photos — especially useful for comparing the same rose variety across different gardens.

**Scope:**
- Requires **Supabase Auth** (users table, `user_id` on plants/photos/gardens)
- "Club" concept: invite-only group, members can view each other's gardens
- Browse view: filter by rose variety, see all member photos of that rose side-by-side
- Privacy controls: members opt-in to sharing with the club

**Effort:** Large (requires auth + multi-user schema additions)

---

## 📣 Social Sharing — Two Options

### Option A: Built-in Rosarium Social Feed *(recommended)*
**What:** A dedicated feed inside the app where you post a plant update (photo + caption + stats), club members can comment, react, or ask questions.

**Why it fits:** Your data (vigor scores, bloom stage, pruning model) adds context that generic social media can't. A comment like "your Olympiad vigor dropped to 3 — have you checked for blackspot?" is only possible because the data lives here.

**Scope:**
- New `posts` table (plant_id, photo_id, caption, created_at, user_id)
- New `comments` table (post_id, author, body, created_at)
- Feed page in bottom nav
- Reactions (👍 / 🌹) as a simple counter

**Effort:** Large

---

### Option B: Share to External Social Media
**What:** One-tap share of a plant update to Instagram, Facebook, X, etc.

**How it works:** Generate a shareable image (plant name + photo + stats overlay) and open the native share sheet via the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API) — works on mobile browsers and installed PWA.

**Scope:**
- "Share" button on plant detail page
- Uses `navigator.share({ title, text, url })` or `navigator.share({ files: [imageBlob] })`
- Optionally: canvas-rendered "stat card" image (rose name, vigor/health scores, bloom stage badge)

**Effort:** Small–Medium (Web Share API is straightforward; stat card image generation adds complexity)

---

## Recommended Sequence

1. **PWA Icons** — 10 minutes, makes the home screen shortcut look right
2. **allowedDevOrigins** — 1 line config fix
3. **Photo Gallery** — highest immediate value, data is already being collected
4. **Share to External Social** — quick win, drives engagement, no auth needed
5. **Supabase Auth** — prerequisite for everything multi-user
6. **Club Member Gardens** — needs auth first, enables everything below
7. **Built-in Rosarium Feed** — builds on club members feature
8. **Bloom Prediction** — needs several months of log data to be meaningful
9. **Offline / Service Worker** — polish for PWA completeness

---

## 🔐 Supabase Auth (Prerequisite for Multi-User Features)

**What:** Add login/signup so multiple people (you, Sophie, Saul, club members) can each have their own account and see each other's gardens when invited.

**Scope:**
- Enable Supabase Auth (email/magic link is simplest — no passwords)
- Add `user_id` to `plants`, `gardens`, `photos`, `logs` (already columns in schema, currently null)
- Add RLS policies so each user only sees their own data by default
- Add a simple `/login` page and session handling via `@supabase/ssr`
- Invite flow: generate a shareable link that pre-joins someone to your club

**Effort:** Large (but Supabase handles most of the hard parts)

---

## 📱 Offline Support / Service Worker

**What:** The app currently requires network for every page load. A service worker would cache the plant list and recent logs so the app works in the garden with spotty WiFi, and queues log entries to sync when back online.

**Scope:**
- Use `next-pwa` or a custom service worker via `public/sw.js`
- Cache strategy: stale-while-revalidate for plant/garden data
- Background sync: queue `createLog` calls when offline, replay on reconnect
- Show an "offline" banner when network is unavailable

**Effort:** Medium

---

## 📈 Bloom Prediction & Analytics Expansion

**What:** Once enough log data accumulates (3–6 months), predict next bloom date per plant based on historical bloom intervals. The analytics engine is partially built (`avg_bloom_interval_days` is already calculated in `src/lib/analytics.ts`).

**Scope:**
- "Next bloom estimate" card on plant detail page
- Dashboard widget showing which plants are approaching bloom in the next 7–14 days
- Seasonal performance comparison (this year vs last year)
- Export analytics as PDF report (useful for rose society presentations)

**Effort:** Medium (infrastructure exists, needs UI + more data)