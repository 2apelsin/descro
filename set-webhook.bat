@echo off
echo Setting up Telegram webhook...
echo.

curl -X POST "https://api.telegram.org/bot8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU/setWebhook" -H "Content-Type: application/json" -d "{\"url\":\"https://descro-production.up.railway.app/api/telegram/webhook\"}"

echo.
echo.
echo Checking webhook status...
echo.

curl "https://api.telegram.org/bot8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU/getWebhookInfo"

echo.
echo.
echo Done! Now test the bot at https://t.me/Telegagocod_bot
pause
