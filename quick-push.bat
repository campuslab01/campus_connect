@echo off
echo === Pushing Changes to Frontend (Vercel) ===
cd /d "%~dp0"
git add .
git commit -m "Fix CORS for Vercel, fix linter errors, and disable matching check"
git push origin main
if %errorlevel% neq 0 (
    echo Failed to push frontend. Trying to pull first...
    git pull origin main --rebase
    git push origin main
)

echo.
echo === Pushing Changes to Backend (Render) ===
cd server
git add .
git commit -m "Fix CORS for all Vercel deployments and verify matching check disabled"
git push origin main
if %errorlevel% neq 0 (
    echo Failed to push backend. Trying to pull first...
    git pull origin main --rebase
    git push origin main
)
cd ..

echo.
echo === Done! ===
echo Frontend will deploy on Vercel automatically
echo Backend will deploy on Render automatically
pause

