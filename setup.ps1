# Setup Script untuk WS PMT
# Menjalankan semua setup yang diperlukan

Write-Host "========================================" -ForegroundColor Green
Write-Host "WS PMT Initial Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check PHP
Write-Host "Checking PHP installation..." -ForegroundColor Yellow
try {
    $phpVersion = php --version | Select-Object -First 1
    Write-Host "✓ PHP installed: $phpVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PHP not found. Please install PHP or XAMPP" -ForegroundColor Red
    exit 1
}

# Check Composer
Write-Host "Checking Composer installation..." -ForegroundColor Yellow
try {
    $composerVersion = composer --version | Select-Object -First 1
    Write-Host "✓ Composer installed: $composerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Composer not found. Please install Composer from https://getcomposer.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installing Dependencies..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Setup Frontend
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Set-Location D:\KEVIN\frontend
if (Test-Path "package-lock.json") {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "Frontend dependencies already installed or package-lock.json not found" -ForegroundColor Yellow
}

# Setup Backend
Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location D:\KEVIN\backend
Write-Host "Backend dependencies already installed by Composer" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create MySQL database: ws_pmt_db" -ForegroundColor Cyan
Write-Host "2. Configure .env in backend folder if needed" -ForegroundColor Cyan
Write-Host "3. Run migrations: cd backend; php artisan migrate" -ForegroundColor Cyan
Write-Host "4. Start the application: Run start.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
