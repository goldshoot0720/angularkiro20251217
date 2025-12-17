@echo off
echo 正在清除所有快取...

echo.
echo [1/4] 停止開發伺服器...
echo 請手動按 Ctrl+C 停止開發伺服器

echo.
echo [2/4] 清除 Angular 快取...
if exist .angular rmdir /s /q .angular
echo ✓ Angular 快取已清除

echo.
echo [3/4] 清除 dist 資料夾...
if exist dist rmdir /s /q dist
echo ✓ dist 資料夾已清除

echo.
echo [4/4] 清除 node_modules 快取...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ node_modules 快取已清除

echo.
echo ========================================
echo 快取清除完成！
echo ========================================
echo.
echo 請執行以下命令重新啟動：
echo npm start
echo.
pause
