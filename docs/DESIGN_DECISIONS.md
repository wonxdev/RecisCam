# Design Decisions

## Why the Current Structure Was Kept Simple
The application is a small static website with a few pages and a shared stylesheet. For that reason, the repository was organized around clarity and maintainability rather than introducing framework complexity.

## Key Decisions
### 1. Keep the existing HTML-based approach
The current site works without a build step, so the project remains easy to open and deploy as a static site.

### 2. Centralize shared styling
All shared visual rules were placed into assets/css/style.css so that the pages remain consistent and the stylesheet is easier to maintain.

### 3. Separate public and private assets
Files that are meant to be served directly, such as the web app manifest, were placed under public/.

### 4. Add documentation instead of introducing new features
The repository now includes professional documentation that explains purpose, architecture, and development workflow without changing the app experience.

## Tradeoffs
- A static-file approach is easy to host and understand, but it does not provide a large-scale frontend architecture.
- Inline scripts keep the project simple, but they also make the code less modular than a framework-based implementation.
- The current organization prioritizes preserving behavior and improving readability over large-scale refactoring.