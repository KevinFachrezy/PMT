# Setup Laravel Storage Symlink
Write-Host "Setting up Laravel Storage..." -ForegroundColor Cyan

cd backend

# Create storage symlink
Write-Host "`nCreating storage symlink..." -ForegroundColor Yellow
php artisan storage:link

# Create directories if not exist
Write-Host "`nEnsuring storage directories exist..." -ForegroundColor Yellow

$storageDirs = @(
    "storage\app\public\documents",
    "storage\app\public\uploads"
)

foreach ($dir in $storageDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "Already exists: $dir" -ForegroundColor Gray
    }
}

# Set permissions (Windows equivalent)
Write-Host "`nStorage setup complete!" -ForegroundColor Green
Write-Host "Documents will be stored in: storage\app\public\documents" -ForegroundColor Cyan

cd ..
