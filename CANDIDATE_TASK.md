# Angular → React Migration Task

## Overview

This repository contains **ProjectHub** — a small project management application built with **Angular 21**. Your task is to migrate a specific part of it to React.

The application is fully functional. Run it first, explore it, and understand how it works before writing any React code.

```bash
npm install
npm start
# → http://localhost:4200
```

---

## What You Are Migrating

**Migrate the Board page and its supporting infrastructure to React.**

This covers:

| Scope | Details |
|---|---|
| **Board page** | `src/app/pages/board/` — the full Kanban board view |
| **Task Form** | `src/app/components/task-form/` — the add/edit modal |
| **Task Service** | `src/app/services/task.service.ts` — state, persistence |
| **Activity Service** | `src/app/services/activity.service.ts` — live event feed |
| **Models** | `src/app/models/task.model.ts` — all shared types |

You do **not** need to migrate the Dashboard, Tasks table, or Task Detail pages.  
You do **not** need to keep Angular running — deliver a standalone React app.

---

## The Board Page — What It Does

Spend time in the running Angular app before coding. The board has:

1. **Four Kanban columns** — To Do / In Progress / Review / Done
2. **Drag and drop** — cards can be dragged between columns and reordered within a column
3. **Filters** — search by title, filter by priority; both update the board reactively
4. **Add / Edit task** — a modal form with validation opens on "+ Add Task" or the edit button
5. **Delete task** — per-card delete button
6. **Task cards** showing priority badge, project tag, assignee, due date (red if overdue), and tags
7. **Click on card title** navigates to a task detail URL (`/tasks/:id`) — you only need the navigation, not a working detail page

---

## Functional Requirements

Your React implementation must match the Angular behavior:

### Kanban Board
- [ ] Render 4 columns in fixed order: To Do → In Progress → Review → Done
- [ ] Each column shows a task count badge
- [ ] Cards are draggable between columns and reorderable within a column
- [ ] Moving a card to a new column updates its `status`

### Filtering
- [ ] Text search filters cards by title (case-insensitive, live as you type)
- [ ] Priority dropdown filters cards (`critical / high / medium / low / all`)
- [ ] Both filters work simultaneously
- [ ] Clearing filters restores all cards

### Task Card
- [ ] Shows title, priority badge, project tag (with project colour), assignee, due date
- [ ] Due date is **red** when the task is overdue (past due date, not done)
- [ ] Completed tasks (`status === 'done'`) are visually dimmed
- [ ] Edit and delete action buttons visible on hover

### Add / Edit Form
- [ ] Opens in a modal
- [ ] Fields: title (required, 3–120 chars), description, status, priority, assignee, project, due date, tags (comma-separated)
- [ ] Shows field-level validation errors
- [ ] On save: creates or updates the task and closes the modal

### State & Persistence
- [ ] Initial data is the same 20 seeded tasks from the Angular app (copy the seed logic)
- [ ] Task state persists across page refreshes via `localStorage`
- [ ] Adding, editing, moving, and deleting tasks updates state immediately

---

## Technical Requirements

- Use **React 18+** (hooks only — no class components)
- Use **TypeScript**
- You may use any **drag-and-drop library** (e.g. `@dnd-kit/core`, `react-beautiful-dnd`, or your own)
- You may use any **form library** (e.g. `react-hook-form`) or plain controlled inputs
- You may use any **state management** approach (Context, Zustand, Redux — your choice)
- You may use **any CSS approach** (CSS modules, Tailwind, styled-components, etc.)
- **No Angular code** should remain in your deliverable

---

## Angular Concepts to Migrate

This is what makes the task interesting. Here is what the Angular implementation uses — understand it, then choose the right React equivalent:

| Angular | What it does | Your React equivalent |
|---|---|---|
| `signal<T>()` | Reactive primitive state (search query, filter, form visibility) | `useState` |
| `computed(() => ...)` | Derived state — filtered+sorted task lists, total count | `useMemo` |
| `signal.update(fn)` | Immutable state updates | functional `setState` |
| `effect()` in TaskService | Auto-persists tasks to `localStorage` on every change | `useEffect` watching state |
| `@Injectable({ providedIn: 'root' })` | Singleton service shared across components | React Context + custom hook, or Zustand store |
| `CdkDragDrop` / `cdkDropList` / `cdkDrag` | Drag-and-drop primitives | `@dnd-kit/core` or similar |
| `ReactiveFormsModule` + `FormBuilder` | Typed form with built-in validation | `react-hook-form` or controlled inputs |
| Custom validators (`noWhitespaceValidator`, `futureDateValidator`) | Extra validation rules | Custom validation logic in your form solution |
| `@for (item of list; track item.id)` | List rendering with stable keys | `array.map(item => <El key={item.id} />)` |
| `@if (condition)` | Conditional rendering | `{condition && <El />}` or ternary |
| `[ngClass]` | Conditional CSS classes | `className` + template literal or `clsx` |
| `BehaviorSubject` in ActivityService | A stream of activity events shared app-wide | `useState` in context, or Zustand atom |
| `interval(4000)` + `takeUntil(destroy$)` | Polling — pushes a new activity event every 4 s | `setInterval` inside `useEffect` with cleanup |
| `(cdkDropListDropped)` event | Fires when a drag ends with source + destination info | `onDragEnd` callback in your DnD library |

You do **not** need to migrate the `ActivityService` live feed in full — but the `TaskService` state management is core and must work correctly.

---

## Deliverable

A **new folder** at the root of this repo named `react-board/` containing your React app, bootstrapped however you prefer (Vite + React is recommended).

```
angular-to-react-test/
├── src/                  ← original Angular app, untouched
├── react-board/          ← your deliverable
│   ├── src/
│   ├── package.json
│   └── ...
└── CANDIDATE_TASK.md
```

The React app should start with:

```bash
cd react-board
npm install
npm run dev
```

---

## Evaluation Criteria

We are looking at:

1. **Correctness** — all functional requirements work as described
2. **State architecture** — how you model the TaskService equivalent; is it clean, is it the right tool for the job?
3. **Angular concepts translated correctly** — especially `computed` → `useMemo`, `effect` → `useEffect`, service singleton → shared state
4. **Drag-and-drop** — does it work reliably? cross-column and within-column
5. **Form validation** — does it mirror the Angular form behaviour (error messages per field, submit blocked on invalid)?
6. **Code quality** — component boundaries, naming, no unnecessary complexity
7. **TypeScript** — types should be accurate; avoid `any`

We are **not** evaluating pixel-perfect styling. Functional correctness and code architecture matter far more than visual polish.

---

## Time Budget

This task is designed for **4–6 hours**. Prioritise working functionality over visual polish. If you run out of time, note in a `README.md` inside `react-board/` what you would have done next.

---

## Questions?

If anything in the Angular source is unclear, read the code — it is well-structured and self-explanatory. The Angular template syntax is documented at [angular.dev](https://angular.dev).

Good luck.
