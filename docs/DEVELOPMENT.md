# Development Guide

## Overview
RecisCam is a small static website built with plain HTML, CSS, and JavaScript. The current version has been converted into a frontend-only demo that runs without a backend, making it easier to showcase and host.

## How the Project Was Built
1. The original app was structured as a set of standalone pages for login, registration, student actions, and teacher review.
2. A shared stylesheet was kept in place to preserve a consistent look across the experience.
3. The app logic was consolidated into assets/js/app.js so the UI behavior is easier to follow and maintain.
4. The project was adapted to use browser localStorage and seeded demo data for a fully offline portfolio experience.

## Local Development
- Open the repository root directly in a browser, or serve it with a simple static server.
- No backend, database, or authentication service is required for the demo flow.
- Clearing browser storage resets the demo state.

## Notes for Contributors
- Keep the experience simple and presentation-friendly.
- Prefer small, explicit changes when reorganizing files.
- If new assets are added, place them in the appropriate subfolder under assets.
- Prefer descriptive names and consistent kebab-case for new files.
