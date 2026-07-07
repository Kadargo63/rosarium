# Plan: Rosarium — Rose Intelligence Web App

## GitHub Repo
- SSH: `git@github.com:Kadargo63/rosarium.git`
- HTTPS: `https://github.com/Kadargo63/rosarium`

## Summary
Build Rosarium as a **Next.js 14 web app** (mobile-capable PWA later) backed by Supabase.
Phase 1: personal tracking + club feedback. Architecture is SaaS-ready from day 1 for future multi-tenant expansion.

## User Decisions
- Platform: Web first (Next.js), mobile later
- Auth: No enforced auth Phase 1 (single user, private URL)
- Rose data: Seed from chat.txt (~42 roses)
- Public sale goal: SaaS product for other gardeners
- Phase 1 features: Plant inventory (ARS labels + identity resolver), weekly log entry, plant detail + log history, photo upload, analytics dashboard, club feedback sharing (public link, no login)

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Supabase (PostgreSQL, Storage, RLS)
- Tailwind CSS + shadcn/ui
- Zustand (state)
- React Hook Form + Zod (forms/validation)
- Recharts (analytics charts)
- Vercel (deployment)

## Database Schema
Tables:
- rose_entities (canonical identity, ARS data)
- rose_aliases (trade names, nursery names)
- gardens (named garden areas with location)
- plants (linked to rose_entities, per garden, SaaS-ready user_id)
- logs (vigor, health, bloom_stage, stem_quality, notes — append-only)
- photos (Supabase Storage, linked to plant + optional log)
- feedback (public, plant_id + optional log_id, tags[], rating, comment)

## Project Structure
rosarium/
├── app/
│   ├── page.tsx (Dashboard)
│   ├── plants/page.tsx (Plant list by garden)
│   ├── plants/[id]/page.tsx (Plant detail)
│   ├── plants/add/page.tsx
│   ├── log/[plantId]/page.tsx (Log entry)
│   ├── feedback/[plantId]/page.tsx (Public, no auth)
│   └── analytics/page.tsx
├── components/
├── lib/ (supabase.ts, queries.ts, analytics.ts, resolveRose.ts)
├── store/useStore.ts
├── types/schema.ts
├── constants/
└── supabase/ (migrations/, seed.sql)

## Implementation Phases

### Phase A: Foundation (parallel)
1. Initialize Next.js 14 project with TypeScript, Tailwind, shadcn/ui
2. Set up Supabase project, write migrations for all tables with RLS
3. Write seed.sql from chat.txt rose inventory (~42 roses + aliases + garden assignments)

### Phase B: Core UI
4. Plant list page grouped by garden with ARS label badges (depends on A)
5. Plant detail page: identity card, log timeline, photo gallery (depends on A)
6. Add/Edit plant form with rose identity resolver (name lookup → canonical match) (depends on A)

### Phase C: Logging
7. Log entry form: vigor/health sliders (1–5), bloom stage dropdown, stem quality, notes, optional photo upload to Supabase Storage (depends on B)
8. Log history timeline on plant detail page (depends on 7)

### Phase D: Analytics
9. Analytics page: avg vigor/health per plant, days between blooms, top performers — using Recharts (depends on C)
10. Per-plant mini analytics on plant detail page (depends on 9)

### Phase E: Feedback
11. "Request Feedback" button → generates public shareable link
12. Public /feedback/[plantId] page: name (optional), rating, tag multi-select, comment, photo — no auth required
13. Feedback display section on plant detail page, grouped by tags

### Phase F: Polish + Deploy
14. Responsive mobile layout (TailwindCSS, looks great in phone browser)
15. Vercel deployment + environment variables
16. Copilot master prompt document for continued agent-assisted development

## Verification
1. Seed SQL runs cleanly on fresh Supabase project
2. All 42+ plants appear correctly with ARS labels and garden grouping
3. Log entry round-trip: create → appears in timeline in <2s
4. Photo upload stores to Supabase Storage, displays on plant detail
5. Feedback public link works without auth, submits, appears on plant detail
6. Analytics page shows correct averages (validate against known log data)
7. Mobile browser layout usable with thumb navigation

## SaaS-Ready Decisions
- All tables have user_id UUID column (nullable Phase 1, enforced Phase 2)
- RLS policies written now, disabled Phase 1, enable with auth Phase 2
- rose_entities is global (shared), plants are per-user
- Public feedback routes never require auth (by design)

## Auth Plan
- Phase 1: No auth enforced (private URL, single user)
- Phase 2: Supabase Auth with GitHub OAuth (fastest for personal) + Google OAuth (for club members)
- RLS policies written now, activated when auth is added
- Public feedback routes always remain auth-free

## UI Layout
- Mobile: bottom tab nav (Dashboard / Plants / Log / Analytics)
- Desktop: left sidebar nav
- No hamburger menu

## Photo Handling
- Client-side compression before upload (browser-image-compression library)
- 5MB per-photo hard limit enforced
- Supabase Storage with signed URLs

## Feedback Security
- Honeypot hidden field on feedback form
- Server-side rate limiting on POST /api/feedback (Vercel Edge middleware)
- No auth required — security via obscurity + rate limit is sufficient Phase 1

## Out of Scope (Phase 1)
- Pruning decision engine
- AI insights (LLM integration)
- Cane age tracking
- Push notifications
- Multi-user auth enforcement (schema ready, not enforced)
- QR code labels
- Mobile app (Expo/React Native)

---

## Build Status (2026-07-07)

### ✅ Completed
| Phase | Item | Notes |
|-------|------|-------|
| A | Database schema (001_initial.sql) | All tables, indexes, RLS stubs |
| A | Seed data (002_seed.sql) | 7 gardens, 33 rose entities, ~50 plant instances |
| B | Plant list page (`/plants`) | Grouped by garden, ARS badges |
| B | Plant detail page (`/plants/[id]`) | Analytics strip, gallery, log timeline, feedback, share |
| B | Add plant form (`/plants/add`) | Live rose resolver, garden selector |
| C | Log entry page (`/log/[plantId]`) | Vigor/health/stem sliders, bloom stage, photo upload |
| D | Analytics page (`/analytics`) | Bar chart, top performers, full table |
| E | Feedback API (`POST /api/feedback`) | Rate-limited, honeypot |
| E | Public feedback page (`/feedback/[plantId]`) | No auth, tags, rating, comment |
| F | PWA manifest + icon | `src/app/manifest.ts`, `src/app/icon.tsx` (512×512 ImageResponse) |
| F | allowedDevOrigins | `next.config.js` — dev phone access without CORS warning |
| F | Photo gallery full implementation | Navigation, log context metadata, lazy load |
| F | Web Share API (`ShareButton`) | Native share sheet on mobile, clipboard fallback |
| + | Propagation Tracker | `/propagation` — critical/standard split, tap-to-cycle, progress bar |
| + | Propagation DB migration (003) | `propagation_status`, `propagation_notes` on plants |
| + | PATCH `/api/propagation/[plantId]` | Validated PATCH endpoint |
| + | PWA QR code (`PhoneQR`) | Auto-detects origin, desktop-only, links to `/propagation` |
| + | Architecture doc | `data_architecture.md` — schema, types, queries, component map |

### 🔲 Backlog
| Item | Effort | Blocked by |
|------|--------|------------|
| Supabase Auth (GitHub + Google OAuth) | Large | — |
| Club Member Gardens & Photos | Large | Auth |
| Built-in Social Feed (posts/comments) | Large | Auth + Club |
| Bloom Prediction / Analytics expansion | Medium | More log data |
| Offline / Service Worker | Medium | — |

### Known Tech Debt
- `addPhoto` in Zustand store is a no-op stub
- `resolveRose()` fetches all entities on every keystroke (acceptable at current scale)
- In-memory rate limiter in feedback route resets on server restart
- `PlantWithDetails.latest_log` is not populated by any server query (only Zustand)

### See Also
- Full data model and component dependency map: `data_architecture.md`
- Feature backlog with effort estimates: `TODO.md`
