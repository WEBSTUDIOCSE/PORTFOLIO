# Deploy UAT to Production - Portfolio
# Merges uat into main, switches author to WEBSTUDIOCSE, pushes, and deploys to Vercel production

Write-Host "=== Deploy UAT to Production ==" -ForegroundColor Cyan
Write-Host "Project: Portfolio  |  main -> Vercel Production (saurabhjadhav.in)" -ForegroundColor DarkCyan

# Save current branch to return to it later
$previousBranch = git branch --show-current
Write-Host "Current branch: $previousBranch" -ForegroundColor Yellow

# Switch to main
Write-Host "`nSwitching to main branch..." -ForegroundColor Cyan
git checkout main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error switching to main" -ForegroundColor Red
    exit 1
}

# Update main
Write-Host "Updating main branch..." -ForegroundColor Cyan
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error pulling main" -ForegroundColor Red
    exit 1
}

# Fetch latest uat
Write-Host "`nFetching latest uat branch..." -ForegroundColor Cyan
git fetch origin uat:uat
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error fetching uat" -ForegroundColor Red
    exit 1
}

# Merge uat into main
Write-Host "`nMerging uat into main..." -ForegroundColor Cyan
git merge origin/uat --no-ff -m "Merge uat into main for production release"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nMerge conflict detected!" -ForegroundColor Red
    Write-Host "Please resolve conflicts and try again" -ForegroundColor Yellow
    exit 1
}

# Save current Git config
$originalName = git config user.name
$originalEmail = git config user.email

# Change to WEBSTUDIOCSE author for production commit
Write-Host "`nChanging author to WEBSTUDIOCSE..." -ForegroundColor Cyan
git config user.name "WEBSTUDIOCSE"
git config user.email "saurabhjadhav.webstudio@gmail.com"

# Amend merge commit with production author
git commit --amend --reset-author --no-edit

# Push to main (production)
Write-Host "`nPushing to main (production)..." -ForegroundColor Cyan
git push origin main --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error pushing to production" -ForegroundColor Red
    git config user.name $originalName
    git config user.email $originalEmail
    exit 1
}

# Restore original Git config
git config user.name $originalName
git config user.email $originalEmail
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

# Return to previous feature branch
if ($previousBranch -ne "main" -and $previousBranch -ne "uat") {
    Write-Host "`nReturning to feature branch: $previousBranch..." -ForegroundColor Cyan
    git checkout $previousBranch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Switched back to $previousBranch" -ForegroundColor Green
    } else {
        Write-Host "Warning: Could not switch back to $previousBranch" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nStaying on main branch" -ForegroundColor Cyan
}

Write-Host "`n=== Complete! ===" -ForegroundColor Green
Write-Host "Successfully deployed to PRODUCTION!" -ForegroundColor Green
Write-Host "Vercel will serve the build at your production domain." -ForegroundColor Cyan
Write-Host "`nCurrent branch: $(git branch --show-current)" -ForegroundColor Cyan
