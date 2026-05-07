# Push to UAT Branch + Deploy Vercel Preview - Portfolio
# Pushes current state to uat and deploys a Vercel preview deployment

Write-Host "=== Push to UAT + Deploy Preview ==" -ForegroundColor Cyan
Write-Host "Project: Portfolio  |  Target: UAT (Preview)" -ForegroundColor DarkCyan

# Check current branch
$currentBranch = git branch --show-current

if ($currentBranch -eq "uat") {
    Write-Host "Already on uat branch" -ForegroundColor Green
} else {
    Write-Host "Switching to uat branch..." -ForegroundColor Yellow
    git checkout uat
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error switching to uat branch" -ForegroundColor Red
        exit 1
    }
}

# Commit any pending changes
$status = git status --porcelain
if ($status) {
    Write-Host "`nUncommitted changes detected - committing..." -ForegroundColor Yellow
    git status --short
    $msg = Read-Host "Enter commit message (or press Enter for auto-message)"
    if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "chore: push to uat" }
    git add .
    git commit -m $msg
}

# Switch author to WEBSTUDIOCSE (required for Vercel team access)
$originalName = git config user.name
$originalEmail = git config user.email
Write-Host "`nSwitching author to WEBSTUDIOCSE for Vercel deploy..." -ForegroundColor Cyan
git config user.name "WEBSTUDIOCSE"
git config user.email "saurabhjadhav.webstudio@gmail.com"
git commit --amend --reset-author --no-edit 2>$null

# Push to uat (force needed because commit hash changed after amend)
Write-Host "`nPushing to uat branch..." -ForegroundColor Cyan
git push origin uat --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error pushing to uat" -ForegroundColor Red
    git config user.name $originalName
    git config user.email $originalEmail
    exit 1
}

# Restore original Git config
Write-Host "Restoring original author..." -ForegroundColor Cyan
git config user.name $originalName
git config user.email $originalEmail

# Deploy to Vercel UAT (Preview)
Write-Host "`n Deploying to Vercel UAT preview..." -ForegroundColor Cyan
vercel --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nWarning: Vercel preview deploy failed." -ForegroundColor Yellow
    Write-Host "Make sure you are logged in: vercel login" -ForegroundColor Gray
    Write-Host "And linked to the project: vercel link" -ForegroundColor Gray
} else {
    Write-Host "Vercel UAT preview deployed!" -ForegroundColor Green
}

Write-Host "`n=== Complete! ===" -ForegroundColor Green
Write-Host "Pushed to uat and preview deployed!" -ForegroundColor Green
