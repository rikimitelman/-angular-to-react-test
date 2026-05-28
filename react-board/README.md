# React Kanban Board

## Setup

```bash
cd react-board
npm install
npm run dev
```

## Tech Stack

* React
* TypeScript
* Material UI
* React Router
* Vite
* React Context + custom hooks
* Native HTML Drag and Drop

## Implemented Features

* Kanban board with 4 columns
* Drag & drop between columns using native HTML Drag and Drop
* Add / edit task modal
* Task filtering (search, assignee, priority)
* Task persistence using localStorage
* Seeded mock data
* Task validation
* Responsive UI using Material UI
* Hover actions for edit/delete
* Modular component architecture
* Shared utility and styles files
* Controlled form inputs with validation

## Angular Concepts Migrated

* signal<T>() → useState
* computed(() => ...) → useMemo
* signal.update(fn) → functional setState
* effect() persistence → useEffect
* Injectable service → React Context + custom hook
* CdkDragDrop → native HTML Drag and Drop
* ReactiveFormsModule → controlled inputs + custom validation

## Additional Improvements

If I had more time, I would add:

* Dedicated task details page
* Unit tests
* Better mobile responsiveness
* Keyboard accessibility improvements
* Animations for drag & drop interactions
* Toast notifications for actions
* Stronger typing for shared form payloads
