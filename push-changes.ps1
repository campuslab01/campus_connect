# PowerShell script to push changes to both frontend and backend repositories

Write-Host "=== Checking Git Status ===" -ForegroundColor Cyan

# Check main repository
Write-Host "`n--- Main Repository (Frontend for Vercel) ---" -ForegroundColor Yellow
git status --short
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not in a git repository or git not found" -ForegroundColor Red
    exit 1
}

# Check for uncommitted changes
$uncommitted = git status --porcelain
if ($uncommitted) {
    Write-Host "`nStaging all changes..." -ForegroundColor Green
    git add .
    
    Write-Host "Committing changes..." -ForegroundColor Green
    git commit -m "Fix CORS for Vercel, fix linter errors, and disable matching check"
    
    Write-Host "Pushing to main..." -ForegroundColor Green
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend changes pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to push frontend changes" -ForegroundColor Red
        git pull origin main --rebase
        git push origin main
    }
} else {
    Write-Host "No uncommitted changes in main repository" -ForegroundColor Gray
}

# Check server submodule
Write-Host "`n--- Server Repository (Backend for Render) ---" -ForegroundColor Yellow
cd server
if (Test-Path ".git") {
    git status --short
    
    $uncommitted = git status --porcelain
    if ($uncommitted) {
        Write-Host "`nStaging all server changes..." -ForegroundColor Green
        git add .
        
        Write-Host "Committing server changes..." -ForegroundColor Green
        git commit -m "Fix CORS for all Vercel deployments and verify matching check disabled"
        
        Write-Host "Pushing server to origin..." -ForegroundColor Green
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Server changes pushed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to push server changes. Trying to pull first..." -ForegroundColor Yellow
            git pull origin main --rebase
            if ($LASTEXITCODE -eq 0) {
                git push origin main
            } else {
                Write-Host "❌ Failed to pull/push server changes" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "No uncommitted changes in server repository" -ForegroundColor Gray
    }
} else {
    Write-Host "Server directory is not a git repository" -ForegroundColor Red
}

cd ..

Write-Host "`n=== Done ===" -ForegroundColor Cyan
Write-Host "Frontend (Vercel) deployment should trigger automatically" -ForegroundColor Green
Write-Host "Backend (Render) deployment should trigger automatically" -ForegroundColor Green

