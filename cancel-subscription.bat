@echo off
echo Отмена подписки...
curl -X POST https://descro-production.up.railway.app/api/admin/cancel-subscription ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"komkort778@gmail.com\"}"
echo.
echo Готово! Обновите страницу дашборда.
pause
