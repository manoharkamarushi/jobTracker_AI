# JobTracker AI

A fully client-side job application tracker built with React + Vite. No backend, no login, no cloud — all data stored locally in your browser via IndexedDB.

---

## Features

- **Kanban Board** — drag cards across 5 columns: Saved → Applied → Follow-Up → Interview → Offer/Rejected
- **Offers Table** — sortable table showing only offer-stage jobs; best offer row highlighted with trophy
- **Filter Bar** — search by company/title, filter by referral, filter to jobs with offers, multi-select tag filter
- **Add / Edit Jobs** — modal form with fields: company, job title, URL, resume used, status, referral toggle + referred-by, tags (Enter/comma to add), expected CTC, offered CTC, notes
- **Seed Data** — 3 sample jobs loaded automatically on first launch (Google, Zepto, Razorpay)
- **Fully offline** — zero network calls; data persists in IndexedDB between sessions

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Database | IndexedDB via [`idb`](https://github.com/jakearchibald/idb) |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Modal | `@headlessui/react` Dialog |
| Dates | `date-fns` |

---

## Setup

**Requirements:** Node.js 18+

```bash
# 1. Clone repo
git clone <repo-url>
cd job-tracker

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── components/
│   ├── Board/
│   │   ├── KanbanBoard.jsx     # DndContext, DragOverlay, column layout
│   │   ├── KanbanColumn.jsx    # Droppable column with SortableContext
│   │   └── JobCard.jsx         # Draggable card with edit/delete actions
│   ├── Filters/
│   │   └── FilterBar.jsx       # Search + referral + offer + tag filters
│   ├── Modals/
│   │   └── JobFormModal.jsx    # Add/Edit job form (Headless UI Dialog)
│   ├── Offers/
│   │   └── OffersTable.jsx     # Sortable offers-only table
│   └── UI/
│       ├── Badge.jsx           # Colored tag badge
│       ├── Toggle.jsx          # Accessible pill toggle
│       └── Tooltip.jsx         # Hover tooltip
├── db/
│   └── indexedDB.js            # DB open/read/write/delete helpers
├── hooks/
│   └── useJobs.js              # Job state + seed data + CRUD callbacks
├── utils/
│   └── helpers.js
├── App.jsx                     # Root: navbar, view switch, modal wiring
├── main.jsx
└── index.css                   # @import "tailwindcss"
```

---

## Kanban Columns

| Key | Label |
|---|---|
| `saved` | Saved |
| `applied` | Applied |
| `followUp` | Follow-Up |
| `interview` | Interview |
| `offer` | Offer / Rejected |

Drag a card to any column to update its status instantly.

---

## Data Storage

- DB name: `job-tracker-db`
- Store: `jobs` (autoIncrement `id`)
- All data lives in the browser — clearing site data resets the app (seed data reloads on next visit)

---

## Clearing / Resetting Data

Open browser DevTools → Application → IndexedDB → `job-tracker-db` → delete database. Refresh to reload seed data.
