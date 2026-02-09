# timeless-love-anniversary-app

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-fast-646cff?logo=vite)
![MIT License](https://img.shields.io/badge/License-MIT-green)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448c5?logo=cloudinary)
![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-brightgreen)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20First-orange)
![Status](https://img.shields.io/badge/Status-Active-success)

A romantic, interactive anniversary gift builder. Create a personalized experience with names, photos, music, love letters, timeline moments, and a surprise reveal. Then share it with a single link.

## Live
- Live site: https://anniversary-sp.vercel.app/
- Vercel project: https://vercel.com/navaneeth-k-vs-projects/anniversary-sp/HTGwuC9TnCJ2w4HpwHgZ44ivuZBE

## Features
- Guided creator mode for names, date, letters, timeline, photos, and music
- Multiple unlock modes for the surprise reveal
- Shareable link generation
- Local draft save and JSON export/import for backup
- Optional Cloudinary upload support for reliable media sharing

## Tech Stack
- React + Vite
- React Router
- Tailwind CSS
- Framer Motion

## Getting Started
```bash
npm install
npm run dev
```

## Usage
1. Open the Creator page and fill in the details.
2. Add photos and music.
3. Click **Copy share link** and send it to your partner.
4. Use **Generate Anniversary Experience** to preview the gift.

### Sharing Tips (Important)
- Avoid large embedded media in the link.
- Use hosted URLs for photos and audio (Cloudinary works well).
- Very long URLs can break in some browsers and services.

### JSON Export/Import
- JSON export is a backup for yourself, not for sharing with someone.
- If you export, you can import the same file later to continue editing.

## Screenshots
Add your screenshots to the `screenshots` folder and update the files below:

![Creator Page](screenshots/creator.png)
![Gift Page](screenshots/gift.png)
![Preview Page](screenshots/image.png)

## Deployment Notes
This project uses client-side routing. The `vercel.json` file includes a rewrite rule so links like `/anniversary?data=...` work on refresh and direct visits.

## License
MIT. See `LICENSE`.
