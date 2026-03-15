# Deploy Frontend -- GitHub Pages

The frontend is deployed as a static site to GitHub Pages via the workflow at `.github/workflows/deploy-frontend.yml`.

## How it works

1. On every push to `main`, the workflow installs dependencies, builds the Vite project, and publishes `frontend/dist` to the `gh-pages` branch.
2. GitHub Pages serves the contents of that branch at `https://<user>.github.io/planning-center-schedule-manager/`.

## Setup steps

### 1. Enable GitHub Pages

1. Go to **Settings > Pages** in your GitHub repository.
2. Under **Source**, select **Deploy from a branch**.
3. Select the `gh-pages` branch and `/ (root)` folder.
4. Click **Save**.

### 2. Set the backend URL

The frontend needs to know where the backend API lives. This is injected at build time via a GitHub Actions **variable** (not a secret -- it's a public URL).

1. Go to **Settings > Secrets and variables > Actions > Variables**.
2. Click **New repository variable**.
3. Name: `VITE_API_BASE_URL`
4. Value: your Render backend URL, e.g. `https://pcsm-backend.onrender.com`
5. Click **Add variable**.

### 3. Push to main

```bash
git push origin main
```

The workflow will run automatically. After it completes, the site is live at your GitHub Pages URL.

## Troubleshooting

### Blank page after deploy

Make sure `vite.config.ts` has the correct `base` path matching your repo name:

```ts
export default defineConfig({
  base: "/planning-center-schedule-manager/",
});
```

### API calls fail with CORS error

Make sure the backend's `Cors__AllowedOrigins` environment variable includes your GitHub Pages URL (e.g. `https://<user>.github.io`).

### Build uses localhost instead of production URL

Check that the `VITE_API_BASE_URL` repository variable is set (Settings > Secrets and variables > Actions > Variables). The workflow reads it via `${{ vars.VITE_API_BASE_URL }}`.
