@echo off
title Clean up history and publish portfolio
cd /d "%~dp0"
echo.
echo  One-time cleanup: remove unpublished flash flood results and old history
echo  -------------------------------------------------------------------------
for /f "delims=" %%b in ('git branch --show-current') do set BR=%%b
if /i not "%BR%"=="main" (
  echo  On branch "%BR%", switching to main...
  git checkout -q main || goto fail
)

echo  [1/5] Removing the flash flood map image...
if exist "assets\img\flash-flood-map.webp" (
  git rm -q -f --ignore-unmatch "assets/img/flash-flood-map.webp"
  if exist "assets\img\flash-flood-map.webp" del /q "assets\img\flash-flood-map.webp"
  echo        Removed.
) else (
  echo        Already gone.
)

echo  [2/5] Saving current changes...
git add -A || goto fail
git reset -q -- publish-site.bat clean-and-publish.bat
git diff --cached --quiet
if errorlevel 1 (
  git commit -q -m "Remove unpublished flash flood project" || goto fail
)

echo  [3/5] Keeping a local safety copy of the old history (branch: backup-before-cleanup)...
git branch -f backup-before-cleanup HEAD || goto fail

echo  [4/5] Replacing history with one clean commit...
git checkout -q --orphan clean-main || goto fail
git commit -q -m "Portfolio site: GeoAI, remote sensing and GIS" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01Japdb1kNcSXgNWWmQAKsyu" || goto fail
git branch -D main >nul || goto fail
git branch -m main || goto fail
git branch -D redesign >nul 2>&1

echo  [5/5] Publishing to GitHub (replaces the old history there)...
git push --force origin main || goto fail
echo.
echo  DONE. The site updates in 1-2 minutes:
echo  https://muhammadshahidusman.github.io
echo  Old history is kept only on this computer, in branch backup-before-cleanup.
echo.
pause
exit /b 0

:fail
echo.
echo  STOPPED: the step above failed. Nothing after it was run.
echo  Take a screenshot of this window and send it to Claude.
echo.
pause
exit /b 1
