@echo off
setlocal

echo === Syncing Local NotesVault Environment ===

:: Define source and target paths
set SRC_API=d:\NotesVault\NotesVault\api
set DEST_API=C:\xampp\htdocs\notesvault\api
set ENV_FILE=d:\NotesVault\NotesVault\notesvault-react-mvp\.env.local
set DB_DUMP=d:\NotesVault\NotesVault\db_dump.sql

:: Create target directory if missing
if not exist "%DEST_API%" (
    echo Creating API directory...
    mkdir "%DEST_API%"
)

:: Copy API files
echo Copying API files...
xcopy /E /Y /I "%SRC_API%\*" "%DEST_API%\"

:: Force local API URL override
echo Setting local API URL override...
del "%ENV_FILE%" >nul 2>&1
echo VITE_API_BASE_URL=http://localhost/notesvault/api > "%ENV_FILE%"

:: Drop and recreate local database
echo Dropping and recreating local database...
"C:\xampp\mysql\bin\mysql.exe" -u root -pYOURPASSWORD -e "DROP DATABASE IF EXISTS notesvault_local; CREATE DATABASE notesvault_local;"

:: Import production dump
if exist "%DB_DUMP%" (
    echo Importing production DB dump...
    "C:\xampp\mysql\bin\mysql.exe" -u root -pYOURPASSWORD notesvault_local < "%DB_DUMP%"
) else (
    echo DB dump not found at %DB_DUMP%
)

:: Start XAMPP Apache and MySQL
echo Starting XAMPP services...
"C:\xampp\xampp_start.exe"

:: Start React dev server in new terminal
echo Starting React dev server...
start cmd /k "cd /d d:\NotesVault\NotesVault\notesvault-react-mvp && npm run dev"

:: Open React app in browser
echo Opening React app in browser...
start http://localhost:5173

echo === Local environment sync complete ===
pause