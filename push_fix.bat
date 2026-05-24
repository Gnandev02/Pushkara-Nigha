@echo off
"C:\Program Files\Git\bin\git.exe" add -A
"C:\Program Files\Git\bin\git.exe" status
"C:\Program Files\Git\bin\git.exe" commit -m "fix: enforce login-first auth flow for Vercel deployment"
"C:\Program Files\Git\bin\git.exe" push
echo Done.
