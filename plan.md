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
