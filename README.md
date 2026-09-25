# Cordoval Snakes

A clean, private browser snake game for [Cordoval](https://cordoval.co.uk). Play on a grid, beat your own best score, and keep everything on your device.

**Live URL (planned):** [snakes.cordoval.co.uk](https://snakes.cordoval.co.uk)

## Features

- Classic snake: arrow keys, WASD, swipe, and an on-screen direction pad on touch devices
- Grow when you eat, game over on walls or self-collision, with restart
- Current score and best score (best score stored in **IndexedDB** only)
- Pause and restart during play
- On first visit, requests `navigator.storage.persist()`; if the browser will not persist data, you are prompted to use Backup
- **Backup / Load:** download or restore a JSON file of this app’s IndexedDB data (`formatVersion` 1, `productSlug` `snakes`). Files stay on your machine; nothing is uploaded
- British English UI, no accounts, no ads, no cloud user data

## Tech stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- Static site suitable for [Vercel](https://vercel.com/) or any static host

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Privacy

High scores and backups are stored locally in your browser. See Cordoval [Terms](https://scrub.cordoval.co.uk/terms) and [Privacy](https://scrub.cordoval.co.uk/privacy).
