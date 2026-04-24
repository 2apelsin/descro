const TelegramBot = require('node-telegram-bot-api');
const jwt = require('jsonwebtoken');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU';
const JWT_SECRET = process.env.JWT_SECRET || 'descro_jwt_secret_change_this_to_random_string_min_32_chars';
const SITE_URL = process.env.SITE_URL || 'https://descro-production.up.railway.app';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Descro Telegram Bot started...');

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;

  console.log(`📥 /start from user ${user.id} (${user.username || user.first_name})`);

  try {
    // Генерируем JWT токен
    const token = jwt.sign(
      {
        telegram_id: user.id,
        username: user.username || null,
        first_name: user.first_name || null,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Создаём ссылку для авторизации
    const loginUrl = `${SITE_URL}/auth/callback?token=${token}`;

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
    await bot.sendMessage(chatId, 
      '❌ Произошла ошибка. Попробуйте позже или обратитесь в поддержку.'
    );
  }
});

// Обработка команды /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId,
    `📖 Помощь по боту Descro\n\n` +
    `Команды:\n` +
    `/start — Войти на сайт\n` +
    `/help — Показать эту справку\n\n` +
    `Если у вас возникли проблемы, напишите на support@descro.ru`
  );
});

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Stopping bot...');
  bot.stopPolling();
  process.exit(0);
});
