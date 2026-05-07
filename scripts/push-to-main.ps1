# Push to Main with WEBSTUDIOCSE Author + Deploy Vercel Production - Portfolio
# Changes Git author, pushes to main, deploys to Vercel production, then restores settings

Write-Host "=== Push to Main (WEBSTUDIOCSE) + Deploy Production ==" -ForegroundColor Cyan
Write-Host "Project: Portfolio  |  Target: main (Production -> saurabhjadhav.in)" -ForegroundColor DarkCyan

# Ensure we are on main
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "Switching to main branch..." -ForegroundColor Yellow
    git checkout main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error switching to main" -ForegroundColor Red
        exit 1
    }
}

# Save current Git config
$originalName = git config user.name
$originalEmail = git config user.email
Write-Host "Current author: $originalName <$originalEmail>" -ForegroundColor Yellow

# Change to WEBSTUDIOCSE author
Write-Host "`nChanging author to WEBSTUDIOCSE..." -ForegroundColor Cyan
git config user.name "WEBSTUDIOCSE"
git config user.email "saurabhjadhav.webstudio@gmail.com"

# Amend last commit with new author
Write-Host "Amending last commit with new author..." -ForegroundColor Cyan
git commit --amend --reset-author --no-edit

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error amending commit. Restoring original author..." -ForegroundColor Red
    git config user.name $originalName
    git config user.email $originalEmail
    exit 1
}

# Push to main
Write-Host "Pushing to main branch..." -ForegroundColor Cyan
git push origin main --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error pushing to main. Restoring original author..." -ForegroundColor Red
    git config user.name $originalName
    git config user.email $originalEmail
    exit 1
}

# Restore original Git config
Write-Host "`nRestoring original author..." -ForegroundColor Cyan
git config user.name $originalName
git config user.email $originalEmail

Write-Host "`n=== Git Done! ===" -ForegroundColor Green
Write-Host "Pushed to main as WEBSTUDIOCSE" -ForegroundColor Green
Write-Host "Restored author: $originalName <$originalEmail>" -ForegroundColor Green

# Deploy to Vercel Production
Write-Host "`n Deploying to Vercel PRODUCTION..." -ForegroundColor Cyan
vercel --prod --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nWarning: Vercel production deploy failed." -ForegroundColor Yellow
    Write-Host "Make sure you are logged in: vercel login" -ForegroundColor Gray
    Write-Host "And linked to the project: vercel link" -ForegroundColor Gray
} else {
    Write-Host "Vercel production deployed!" -ForegroundColor Green
}

Write-Host "`n=== Complete! ===" -ForegroundColor Green
Write-Host "Deployed to PRODUCTION!" -ForegroundColor Green
