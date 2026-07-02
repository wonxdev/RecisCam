# RecisCam — Portfolio Demo

RecisCam is a Progressive Web App (PWA) concept for **school piket (cleaning duty) attendance**, using camera photo capture as proof of attendance. This is the **portfolio version**: it demonstrates the full attendance workflow — login, photo submission, teacher review, and export — entirely in the browser, with **no real backend or database**.

> 🧪 **This is a demo.** All data is sample data generated in your browser's `localStorage`. Nothing is uploaded anywhere, and nothing here represents a real school, student, or teacher.

## Features

- **Student dashboard**
  - View piket schedule and day of the week assigned
  - "Upload" a photo as proof of attendance (stored as a filename only in the demo)
  - See attendance history for the last 5 scheduled weeks
  - See a running "warning count" for missed/rejected reports
  - In-app notifications when a teacher approves or rejects a report
- **Teacher dashboard**
  - Review all submitted attendance reports
  - Filter reports by piket day
  - Approve or reject reports with an optional note
  - Export the current list to an Excel file (`.xlsx`)
- **Demo login / registration**
  - Two ready-made demo accounts (student and teacher) with one-tap login
  - A registration form that creates a new local student profile
- A **Portfolio Demo** badge is shown on every page as a reminder that this is a demo

## Technologies

- HTML5, CSS3, vanilla JavaScript (no framework, no build step)
- Browser `localStorage` as a stand-in for a database
- [SheetJS (xlsx)](https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js) via CDN, for the Excel export feature only
- Works as a static site — deployable directly on GitHub Pages

## Folder Structure

```
/
├── assets/
│   ├── css/
│   │   └── style.css        # All page styling
│   ├── js/
│   │   ├── app.js           # Shared helpers (demo badge, auth guard, logout)
│   │   ├── demo-store.js    # Fake backend backed by localStorage
│   │   ├── index.js         # Login page logic
│   │   ├── register.js      # Registration page logic
│   │   ├── student.js       # Student dashboard logic
│   │   └── teacher.js       # Teacher dashboard logic
│   └── icons/
│       └── icon.svg         # App icon (used by manifest.json)
├── demo/
│   └── demo-data.js         # Sample profiles & attendance records (fictional)
├── docs/
│   ├── README.md
│   ├── CHANGELOG.md
│   └── LICENSE
├── pages/
│   ├── register.html          # Registration page
│   ├── student.html           # Student dashboard
│   └── teacher.html           # Teacher dashboard
├── index.html                # Login page (entry point, kept at the root)
└── manifest.json               # PWA manifest
```

`index.html` stays at the project root so GitHub Pages (and any static host) serves it as the default entry point. Every other page lives in `pages/` and reaches `assets/`, `demo/`, and `manifest.json` via a relative `../` path.

## Demo Mode

The original project used [Supabase](https://supabase.com) (auth + database + storage) as its backend. The portfolio version removes that dependency entirely:

- `demo/demo-data.js` defines a small set of fictional profiles and attendance records.
- `assets/js/demo-store.js` is a lightweight fake API (`DemoStore`) that reads/writes this data to `localStorage`, mimicking the shape of the original Supabase calls (login, register, submit attendance, approve/reject, notifications).
- Photo uploads are not actually stored anywhere outside your browser session — only the filename is kept, and the image preview uses a temporary local object URL.
- Use the two "Coba sebagai Siswa / Guru" buttons on the login page to explore both roles instantly, or register a new demo student.
- Refreshing the page keeps your changes (they're saved in `localStorage`). To start over, clear your browser's site data for this page.
- Login/logout and role checks redirect between `index.html` (root) and the pages inside `pages/`, so opening any page directly (e.g. `pages/student.html`) without a demo session will safely bounce you back to the login screen.

## How to Run

No build step or server required.

1. Download or clone this repository.
2. Open `index.html` directly in a browser, **or**
3. Serve the folder with any static file server, e.g.:
   ```bash
   npx serve .
   ```
4. Deploy to GitHub Pages by enabling Pages on the repository (serving from the root or `/docs`, per your GitHub Pages settings) — no configuration files needed.

## Limitations

- This is a **demo only** — there is no real authentication, database, or file storage.
- Data lives only in the current browser's `localStorage` and is not shared between devices or visitors.
- Photo "uploads" are not persisted as image files; only the filename is recorded.
- Not intended for production use as-is.

## Future Improvements

- Optional: swap `demo-store.js` for a real backend (Supabase, Firebase, or a custom API) without changing the UI layer.
- Add real image compression/storage for photo proof.
- Add multi-class / multi-teacher role management.
- Add automated tests for the demo store logic.

## Author

Portfolio project maintained as a demonstration of a camera-based school attendance workflow.
