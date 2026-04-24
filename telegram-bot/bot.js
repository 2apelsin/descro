const TelegramBot = require('node-telegram-bot-api');
const jwt = require('jsonwebtoken');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU';
const JWT_SECRET = process.env.JWT_SECRET || 'descro_jwt_secret_change_this_to_random_string_min_32_chars';
const SITE_URL = process.env.SITE_URL || 'https://descro-production.up.railway.app';
const USE_WEBHOOK = process.env.USE_WEBHOOK === 'true';
const WEBHOOK_URL = process.env.WEBHOOK_URL; // https://descro-production.up.railway.app/api/telegram/webhook

let bot;

if (USE_WEBHOOK && WEBHOOK_URL) {
  // Режим webhook (для продакшена)
  console.log('🤖 Starting bot in WEBHOOK mode...');
  bot = new TelegramBot(BOT_TOKEN);
  bot.setWebHook(`${WEBHOOK_URL}/api/telegram/webhook`).then(() => {
    console.log('✅ Webhook set successfully');
  }).catch(err => {
    console.error('❌ Failed to set webhook:', err);
  });
} else {
  // Режим polling (для локальной разработки)
  console.log('🤖 Starting bot in POLLING mode...');
  try {
    bot = new TelegramBot(BOT_TOKEN, { 
      polling: {
        interval: 2000,
        autoStart: true,
        params: {
          timeout: 10
        }
      }
    });
    console.log('✅ Polling started');
  } catch (error) {
    console.error('❌ Failed to start polling:', error);
    console.log('💡 Tip: If Telegram is blocked, deploy bot to Railway with USE_WEBHOOK=true');
    process.exit(1);
  }
}

// Функция отправки приветственного сообщения
async function sendWelcomeMessage(chatId, user) {
  console.log(`📥 /start from user ${user.id} (${user.username || user.first_name})`);

  try {
    // Создаём прямую ссылку для авторизации (без JWT в боте)
    const loginUrl = `${SITE_URL}/api/auth/demo-login?telegram_id=${user.id}&username=${encodeURIComponent(user.username || '')}&first_name=${encodeURIComponent(user.first_name || '')}`;

    // Отправляем сообщение с кнопкой
    await bot.sendMessage(chatId, 
      `👋 Привет, ${user.first_name}!\n\n` +
      `Добро пожаловать в Descro — AI-генератор описаний для маркетплейсов!\n\n` +
      `🎁 Получите 3 бесплатные генерации в день\n` +
      `⚡ Или активируйте PRO за 199₽/мес\n\n` +
      `Нажмите на кнопку ниже чтобы войти на сайт:`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🔐 Войти на сайт', url: loginUrl }
          ]]
        }
      }
    );

    console.log(`✅ Login link sent to user ${user.id}`);
  } catch (error) {
    console.error('❌ Error:', error);
    try {
      await bot.sendMessage(chatId, 
        '❌ Произошла ошибка. Попробуйте позже или обратитесь в поддержку.'
      );
    } catch (e) {
      console.error('❌ Failed to send error message:', e);
    }
  }
}

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  await sendWelcomeMessage(msg.chat.id, msg.from);
});

// Обработка команды /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId,
      `📖 Помощь по боту Descro\n\n` +
      `Команды:\n` +
      `/start — Войти на сайт\n` +
      `/help — Показать эту справку\n\n` +
      `Если у вас возникли проблемы, напишите на support@descro.ru`
    );
  } catch (error) {
    console.error('❌ Error sending help:', error);
  }
});

// Обработка ошибок polling
if (!USE_WEBHOOK) {
  bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.code, error.message);
    
    if (error.code === 'EFATAL' || error.code === 'ECONNRESET') {
      console.log('💡 Telegram API недоступен. Возможные причины:');
      console.log('   1. Telegram заблокирован в вашей стране');
      console.log('   2. Проблемы с сетью или файрволом');
      console.log('   3. Используйте VPN или разверните бота на Railway с webhook');
      console.log('\n📝 Для webhook установите переменные:');
      console.log('   USE_WEBHOOK=true');
      console.log('   WEBHOOK_URL=https://descro-production.up.railway.app');
    }
  });
}

// Экспорт для webhook
module.exports = { bot, sendWelcomeMessage };

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping bot...');
  if (!USE_WEBHOOK) {
    bot.stopPolling();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Stopping bot...');
  if (!USE_WEBHOOK) {
    bot.stopPolling();
  }
  process.exit(0);
});
