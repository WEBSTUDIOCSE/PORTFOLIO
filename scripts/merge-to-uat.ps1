# Merge Feature to UAT + Deploy to Vercel Preview - Portfolio
# Merges your feature branch into uat and triggers a Vercel preview deployment

Write-Host "=== Merge Feature to UAT + Deploy Preview ===" -ForegroundColor Cyan
Write-Host "Project: Portfolio  |  Target: UAT (Preview)" -ForegroundColor DarkCyan

# Get current branch
$featureBranch = git branch --show-current

# Check if on a feature branch
if ($featureBranch -eq "main" -or $featureBranch -eq "uat") {
    Write-Host "Error: You're on $featureBranch branch. Switch to a feature branch first." -ForegroundColor Red
    exit 1
}

Write-Host "Current branch: $featureBranch" -ForegroundColor Yellow

# Ensure all changes are committed
$status = git status --porcelain
if ($status) {
    Write-Host "`nUncommitted changes detected - committing automatically..." -ForegroundColor Yellow
    git status --short
    $msg = Read-Host "Enter commit message (or press Enter for auto-message)"
    if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "chore: auto-commit before UAT merge" }
    git add .
    git commit -m $msg
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error committing changes" -ForegroundColor Red
        exit 1
    }
    Write-Host "Changes committed" -ForegroundColor Green
}

# Push feature branch
Write-Host "`nPushing $featureBranch to remote..." -ForegroundColor Cyan
git push origin $featureBranch

# Switch to uat
Write-Host "`nSwitching to uat branch..." -ForegroundColor Cyan
git checkout uat
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error switching to uat" -ForegroundColor Red
    exit 1
}

# Update uat
Write-Host "Updating uat branch..." -ForegroundColor Cyan
git pull origin uat
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error pulling uat" -ForegroundColor Red
    exit 1
}

# Merge feature into uat
Write-Host "`nMerging $featureBranch into uat..." -ForegroundColor Cyan
git merge $featureBranch --no-ff -m "Merge $featureBranch into uat"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nMerge conflict detected!" -ForegroundColor Red
    Write-Host "Please resolve conflicts manually:" -ForegroundColor Yellow
    Write-Host "1. Open conflicted files in VS Code" -ForegroundColor Gray
    Write-Host "2. Resolve conflicts" -ForegroundColor Gray
    Write-Host "3. git add ." -ForegroundColor Gray
    Write-Host "4. git commit -m 'Resolve merge conflicts'" -ForegroundColor Gray
    Write-Host "5. Run this script again" -ForegroundColor Gray
    exit 1
}

# ── Switch author to WEBSTUDIOCSE (required for Vercel team access) ──
$originalName = git config user.name
$originalEmail = git config user.email
Write-Host "`nSwitching author to WEBSTUDIOCSE for Vercel deploy..." -ForegroundColor Cyan
git config user.name "WEBSTUDIOCSE"
git config user.email "saurabhjadhav.webstudio@gmail.com"
git commit --amend --reset-author --no-edit 2>$null

# Push to uat (force needed because commit hash changed after amend)
Write-Host "`nPushing to uat..." -ForegroundColor Cyan
git push origin uat --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error pushing to uat" -ForegroundColor Red
    git config user.name $originalName
    git config user.email $originalEmail
    exit 1
}

# Deploy to Vercel UAT (Preview)
Write-Host "`nDeploying to Vercel UAT preview..." -ForegroundColor Cyan
vercel --yes

# Restore original Git config
git config user.name $originalName
git config user.email $originalEmail
Write-Host "Restored author: $originalName <$originalEmail>" -ForegroundColor Gray

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nWarning: Vercel preview deploy failed." -ForegroundColor Yellow
    Write-Host "Make sure you are logged in: vercel login" -ForegroundColor Gray
    Write-Host "And linked to the project: vercel link" -ForegroundColor Gray
} else {
    Write-Host "Vercel UAT preview deployed!" -ForegroundColor Green
}

# Return to feature branch
Write-Host "`nReturning to feature branch: $featureBranch..." -ForegroundColor Cyan
git checkout $featureBranch
if ($LASTEXITCODE -eq 0) {
    Write-Host "Switched back to $featureBranch" -ForegroundColor Green
} else {
    Write-Host "Warning: Could not switch back to $featureBranch" -ForegroundColor Yellow
}

Write-Host "`n=== Complete! ===" -ForegroundColor Green
Write-Host "Feature merged to uat and preview deployed!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test on the Vercel UAT preview URL above" -ForegroundColor Gray
Write-Host "2. If tests pass, run:" -ForegroundColor Gray
Write-Host "      .\scripts\deploy-to-production.ps1" -ForegroundColor Cyan
Write-Host "3. If issues found, fix on $featureBranch and run this script again" -ForegroundColor Gray
Write-Host "`nCurrent branch: $(git branch --show-current)" -ForegroundColor Cyan