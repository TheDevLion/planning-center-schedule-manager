# Deploy Backend -- Render

The backend is a .NET 8 Minimal API deployed as a Docker web service on [Render](https://render.com/).

## How it works

Render builds the Docker image from `backend/Dockerfile`, sets the `PORT` environment variable, and starts the container. The app listens on `http://+:$PORT` automatically.

## Setup steps

### 1. Create a new Web Service on Render

1. Go to [https://dashboard.render.com/](https://dashboard.render.com/) and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the service:

| Setting | Value |
|---|---|
| **Name** | `pcsm-backend` (or your choice) |
| **Region** | Choose the closest to your users |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `backend/Dockerfile` |
| **Docker Context Directory** | `backend` |

4. Click **Create Web Service**.

### 2. Set environment variables

In the Render dashboard, go to your service's **Environment** tab and add:

| Key | Value | Notes |
|---|---|---|
| `Ocr__ApiKey` | Your OCR Space API key | Get one at [ocr.space/ocrapi](https://ocr.space/ocrapi) |
| `Cors__AllowedOrigins` | `https://<user>.github.io` | Your GitHub Pages origin |
| `ASPNETCORE_ENVIRONMENT` | `Production` | Optional, defaults to Production in Docker |

> **Important:** `Cors__AllowedOrigins` must match the **origin** of your frontend (protocol + domain, no trailing slash, no path). Example: `https://myuser.github.io`

### 3. Deploy

Render will auto-deploy on every push to `main`. You can also trigger a manual deploy from the dashboard.

After the first deploy, note the service URL (e.g. `https://pcsm-backend.onrender.com`) -- you'll need it for the frontend's `VITE_API_BASE_URL` variable.

## Verify

```bash
# Health check
curl https://pcsm-backend.onrender.com/health

# Swagger UI
open https://pcsm-backend.onrender.com/swagger
```

## Troubleshooting

### CORS errors from the frontend

Check that `Cors__AllowedOrigins` in Render's environment variables matches your GitHub Pages URL exactly. Multiple origins can be comma-separated:

```
https://myuser.github.io,http://localhost:5173
```

### OCR returns 502

The `Ocr__ApiKey` environment variable is missing or invalid. Verify it in Render's Environment tab.

### Cold start is slow

Render's free tier spins down after inactivity. The first request after idle may take 30-60 seconds. Upgrade to a paid plan for always-on instances.
