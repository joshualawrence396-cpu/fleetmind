# FleetMind Deployment Guide

## Option 1: Vercel (Recommended - 10 minutes)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set these env vars in Vercel Dashboard:
- DATABASE_URL (Neon PostgreSQL)
- NEXTAUTH_SECRET
- NEXTAUTH_URL=https://your-app.vercel.app
- RESEND_API_KEY
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- PAYFAST_MERCHANT_ID
- PAYFAST_MERCHANT_KEY

For ML service: Deploy to Railway or Render:
- railway up (in /routing-service)

## Option 2: Docker

```bash
# Build and run
docker-compose up --build -d

# Check status
docker-compose ps
docker-compose logs -f app
```

## Option 3: Kubernetes

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods -n fleetmind
kubectl get services -n fleetmind
```

## Python ML Service (Required for OR-Tools + Prophet)

```bash
cd routing-service
pip install -r requirements.txt
python main.py
# OR with Docker:
docker build -t fleetmind-ml .
docker run -p 8000:8000 fleetmind-ml
```

## Cloudflare Turnstile Setup (Free human verification)

1. Go to https://dash.cloudflare.com -> Turnstile
2. Add site: fleetmind.co.za
3. Copy Site Key -> NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY
4. Copy Secret Key -> CLOUDFLARE_TURNSTILE_SECRET

## PayFast Sandbox Testing

Test card: 4000 0000 0000 0002
Test EFT: Available in sandbox
Sandbox URL: https://sandbox.payfast.co.za

## Health Checks

- App: /api/me (returns session)
- ML:  http://localhost:8000/health
- Analytics: /api/analytics