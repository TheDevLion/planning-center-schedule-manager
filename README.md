# Planning Center Schedule Manager

A real-time event schedule controller that lets worship teams and event coordinators manage live service sequences. Upload a Planning Center schedule (PDF or image), and control the flow of activities in real time with play/pause, conclude, and navigation controls.


## Features

- **Schedule import** -- Upload a PDF or image of a Planning Center service schedule; the backend uses OCR to parse it into structured activities.
- **Live timeline** -- Track the current activity with an overall timer and per-activity elapsed time.
- **Navigation** -- View previous/next activities, jump back to the live activity, or reopen a past activity as the current one.
- **Inline editing** -- Add, remove, reorder, and edit activities (title, responsible person, duration) from the built-in editor.
- **i18n** -- English (default) and Brazilian Portuguese, switchable from the header.

## Architecture

```
frontend/          React 18 + Vite + Tailwind CSS + Zustand
backend/api/       ASP.NET Core 8 Minimal API (OCR + parser)
```

The frontend is a static SPA that communicates with the backend via a single REST endpoint (`POST /api/file-parse/planning-center-service`). All runtime state (timer, live index, navigation) lives in the browser.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)

## Local Setup

### Backend

```bash
cd backend/api

# Set the OCR API key (get one at https://ocr.space/ocrapi)
dotnet user-secrets set "Ocr:ApiKey" "YOUR_KEY_HERE"

# Run (listens on http://localhost:51278)
dotnet run
```

The backend exposes Swagger UI at [http://localhost:51278/swagger](http://localhost:51278/swagger).

To run in **replay mode** (returns cached OCR results, no API key needed):

```bash
# appsettings.Development.json already sets SnapshotMode to "replay"
dotnet run --environment Development
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Opens at [http://localhost:5173](http://localhost:5173). The `.env` file already points `VITE_API_BASE_URL` to the local backend.

### Type-check

```bash
cd frontend
pnpm typecheck
```

## Environment Variables

### Frontend (build-time)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:51278` |

### Backend (runtime)

| Variable | Description | Default |
|---|---|---|
| `Ocr__ApiKey` | OCR Space API key | *(empty -- required for live OCR)* |
| `Ocr__SnapshotMode` | `off`, `record`, or `replay` | `off` |
| `Cors__AllowedOrigins` | Comma-separated allowed origins | `http://localhost:5173` |
| `PORT` | HTTP port (set by hosting platform) | `8080` |

## Deploy

- [Frontend deploy guide (GitHub Pages)](docs/deploy-frontend.md)
- [Backend deploy guide (Render)](docs/deploy-backend.md)

## License

Public repository. Do not commit secrets (API keys, tokens, credentials, or private data).
