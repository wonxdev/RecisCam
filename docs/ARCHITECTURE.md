# Architecture Overview

## High-Level Structure
RecisCam is a lightweight static web application composed of multiple HTML entry pages, shared styles, and a single JavaScript controller.

- The entry pages represent the main user experiences: login, registration, student dashboard, and teacher dashboard.
- Shared styling is centralized in assets/css/style.css.
- App behavior is handled by assets/js/app.js, which manages localStorage-backed data, demo authentication, and UI actions.
- Public resources such as the web app manifest and local icon are stored in public/.

## Page Responsibilities
- index.html: login page and redirect logic
- pages/register.html: student registration page
- pages/student.html: student attendance submission and history view
- pages/teacher.html: teacher review dashboard and CSV export flow

## Runtime Model
The current architecture is intentionally simple:

- Pages render UI and gather form input.
- The shared JavaScript controller reads and writes data from browser localStorage.
- Demo users, attendance records, and notifications are seeded automatically on first load.
- The teacher view exports the current dataset to CSV for demonstration purposes.

## Design Considerations
The repository is structured as a static, portfolio-friendly demo so it can run without a backend, a database, or any external authentication service. This keeps deployment easy while still showcasing the original workflow in a realistic form.
