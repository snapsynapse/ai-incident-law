# AI Error Litigation Index

Standalone, dependency-free single-page application for browsing the AI Error Litigation Log.

## Files

- `index.html` — application shell.
- `styles.css` — local styles only.
- `app.js` — local search, filtering, rendering, and theme logic.
- `data.js` — embedded local data bundle generated from the CSV source package.
- `scripts/build-data.py` — optional maintainer script for regenerating `data.js` from the local CSV files.

## Portability

The app has no runtime dependencies:

- No framework.
- No package manager.
- No CDN.
- No external fonts.
- No API calls.
- No analytics.
- No cookies, localStorage, sessionStorage, or IndexedDB.

Open `index.html` directly in a browser or host the folder on any static file server. Public-record links are ordinary outbound links and are only loaded if the user clicks them.

## Updating data

If the source CSV files are updated in `../ai-error-litigation-log/data/`, run:

```bash
python scripts/build-data.py
```

Then redistribute this folder or zip it as a portable bundle.
