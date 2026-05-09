# Fast development script
Write-Host "Starting FleetMind in fast mode..." -ForegroundColor Cyan

# Kill existing processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear cache
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Start with Turbo mode for faster compilation
npm run dev -- --turbo
