@echo off
setlocal
cd /d "%~dp0"
echo Opening local preview at http://localhost:8080
python -m http.server 8080
pause
