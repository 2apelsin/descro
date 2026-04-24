// Скрипт для настройки webhook для Telegram бота
// Используйте это вместо polling если Telegram заблокирован

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://descro-production.up.railway.app';

async function setupWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
  const webhookEndpoint = `${WEBHOOK_URL}/api/telegram/webhook`;

  console.log('🔧 Настройка webhook...');
  console.log('📍 URL:', webhookEndpoint);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookEndpoint,
        allowed_updates: ['message', 'callback_query']
      })
    });

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook успешно установлен!');
      console.log('📝 Описание:', data.description);
      
      // Проверяем информацию о webhook
      await checkWebhook();
    } else {
      console.error('❌ Ошибка установки webhook:', data.description);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

async function checkWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.ok) {
      console.log('\n📊 Информация о webhook:');
      console.log('   URL:', data.result.url || 'не установлен');
      console.log('   Pending updates:', data.result.pending_update_count);
      if (data.result.last_error_message) {
        console.log('   ⚠️  Последняя ошибка:', data.result.last_error_message);
        console.log('   Время ошибки:', new Date(data.result.last_error_date * 1000).toLocaleString());
      }
    }
  } catch (error) {
    console.error('❌ Ошибка проверки webhook:', error.message);
  }
}

async function deleteWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`;

  console.log('🗑️  Удаление webhook...');

  try {
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook удален');
    } else {
      console.error('❌ Ошибка удаления webhook:', data.description);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Обработка аргументов командной строки
const command = process.argv[2];

switch (command) {
  case 'set':
    setupWebhook();
    break;
  case 'check':
    checkWebhook();
    break;
  case 'delete':
    deleteWebhook();
    break;
  default:
    console.log('📖 Использование:');
    console.log('   node setup-webhook.js set     - Установить webhook');
    console.log('   node setup-webhook.js check   - Проверить webhook');
    console.log('   node setup-webhook.js delete  - Удалить webhook');
    console.log('\n💡 Переменные окружения:');
    console.log('   TELEGRAM_BOT_TOKEN - токен бота');
    console.log('   WEBHOOK_URL - URL сайта (https://descro-production.up.railway.app)');
}
