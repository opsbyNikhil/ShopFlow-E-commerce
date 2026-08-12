# ==========================================
# ShopFlow - Run All Services
# ==========================================

$ROOT = $PSScriptRoot

# ==========================================
# Auth Service Backend - 8000
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\auth-service'; .\venv\Scripts\Activate.ps1; python manage.py runserver 8000"

# ==========================================
# Auth Service Frontend - 5173
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\auth-service\frontend'; npm run dev -- --port 5173"

# ==========================================
# Home Page Service Backend - 8001
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\home-page-service'; .\venv\Scripts\Activate.ps1; python manage.py runserver 8001"

# ==========================================
# Home Page Service Frontend - 5174
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\home-page-service\frontend'; npm run dev -- --port 5174"

# ==========================================
# Product Service Backend - 8002
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\product-service'; .\venv\Scripts\Activate.ps1; python manage.py runserver 8002"

# ==========================================
# Product Service Frontend - 5175
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\product-service\frontend'; npm run dev -- --port 5175"

# ==========================================
# Cart Service Backend - 8003
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\cart-service'; .\venv\Scripts\Activate.ps1; python manage.py runserver 8003"

# ==========================================
# Cart Service Frontend - 5176
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\cart-service\frontend'; npm run dev -- --port 5176"

# ==========================================
# Order Service Backend - 8004
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\order-service'; .\venv\Scripts\Activate.ps1; python manage.py runserver 8004"

# ==========================================
# Order Service Frontend - 5177
# ==========================================

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$ROOT\order-service\frontend'; npm run dev -- --port 5177"

# ==========================================
# Display Information
# ==========================================

Write-Host ""
Write-Host "=========================================="
Write-Host "       ShopFlow Services Started"
Write-Host "=========================================="

Write-Host ""
Write-Host "Auth Service"
Write-Host "  Backend  : http://127.0.0.1:8000"
Write-Host "  Frontend : http://localhost:5173"

Write-Host ""
Write-Host "Home Page Service"
Write-Host "  Backend  : http://127.0.0.1:8001"
Write-Host "  Frontend : http://localhost:5174"

Write-Host ""
Write-Host "Product Service"
Write-Host "  Backend  : http://127.0.0.1:8002"
Write-Host "  Frontend : http://localhost:5175"

Write-Host ""
Write-Host "Cart Service"
Write-Host "  Backend  : http://127.0.0.1:8003"
Write-Host "  Frontend : http://localhost:5176"

Write-Host ""
Write-Host "Order Service"
Write-Host "  Backend  : http://127.0.0.1:8004"
Write-Host "  Frontend : http://localhost:5177"

Write-Host ""
Write-Host "=========================================="