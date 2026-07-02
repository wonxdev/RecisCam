# RecisCam
RecisCam is a polished frontend-only demo of a school attendance and duty roster workflow for students and teachers. The repository has been adapted into a portfolio-ready static experience that works fully offline through browser storage and seeded demo data.

## Purpose
This project demonstrates how a school-facing web app can be refactored into a self-contained frontend demo for presentations, hiring reviews, and case-study walkthroughs without depending on external services.

## Highlights
- Offline login and registration flow using browser local storage
- Student dashboard for viewing schedules, warnings, and uploading attendance evidence
- Teacher dashboard for reviewing submissions and updating status
- CSV export for attendance summaries
- Local manifest and icon assets for a lightweight PWA-style presentation

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage for persistence
- Static assets only, with no build step required

## Folder Structure
```text
RecisCam/
├── assets/
│   ├── css/
│   └── js/
├── docs/
├── pages/
├── public/
├── index.html
└── README.md
```

## Demo Accounts
Use these credentials to explore the experience locally:
- Teacher: guru@reciscam.test / guru123
- Student: siswa@reciscam.test / siswa123

## Local Usage
1. Clone the repository.
2. Open the project folder directly in a browser, or serve it with a simple static server such as:

```bash
python -m http.server 8000
```

3. Visit http://localhost:8000 and sign in with one of the demo accounts.

## Notes
- The app is intentionally frontend-only and does not require a backend or database service.
- Data is persisted in the browser via localStorage, so clearing site data removes the demo state.
- The project is suitable for static hosting platforms such as GitHub Pages or Netlify.

## License
This project is licensed under the MIT License. See the LICENSE file for details.