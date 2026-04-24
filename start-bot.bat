@echo off
cd telegram-bot
echo Installing dependencies...
call npm install
echo.
echo Starting Telegram bot...
node bot.js
