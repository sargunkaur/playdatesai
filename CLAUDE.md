# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playdates is a single-page landing page for an email waitlist. It features an interactive "hole" button that expands to reveal an email signup form with animated typing effects.

## Commands

```bash
npm run dev      # Start Vite dev server (localhost:5173, network accessible)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
```

No test or lint commands are configured.

## Architecture

**Stack:** Vite + vanilla JavaScript + Supabase (PostgreSQL)

**File Structure:**
- `index.html` - Complete HTML structure with embedded CSS (277 lines)
- `src/main.js` - All JavaScript logic (136 lines)
- `.env` - Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_KEY)

**Main Logic Flow (src/main.js):**
1. Supabase client initialization with environment variable validation
2. Interactive hole mechanism: `openHole()` / `closeHole()` toggle button expansion (140px ↔ 650px)
3. `typeText()` - Animated typing effect when hole opens
4. Form submission inserts email into Supabase `waitlist` table

**State Management:** Single boolean `opened` flag tracks hole expansion state. UI updates via CSS class toggling and direct DOM manipulation.

## Supabase Integration

- Table: `waitlist` with `email` field
- Uses `@supabase/supabase-js` client
- Environment variables exposed via `import.meta.env.VITE_*`

## CSS Architecture

Uses CSS custom properties defined in index.html:
- `--bg`: #ffec89 (light yellow background)
- `--ink`: #ffffff (white text)
- `--hole`: #0b0b0b (dark button)

Animations use cubic-bezier easing (700ms hole expansion, 420ms content fade). Mobile breakpoint at 520px.
