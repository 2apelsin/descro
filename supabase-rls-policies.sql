-- Enable Row Level Security для таблицы payments
-- Это защищает данные платежей от несанкционированного доступа

-- 1. Включить RLS для payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 2. Политика: пользователи могут видеть только свои платежи
CREATE POLICY "Users can view own payments" 
ON payments 
FOR SELECT 
USING (
  auth.uid()::text = user_id OR
  telegram_id::text = auth.uid()::text
);

-- 3. Политика: service_role может управлять всеми платежами (для webhook)
CREATE POLICY "Service role can manage all payments" 
ON payments 
FOR ALL 
USING (auth.role() = 'service_role');

-- 4. Политика: пользователи НЕ могут создавать/изменять платежи напрямую
-- Только через API с service_role ключом

-- Проверка: посмотреть все политики
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'payments';

-- Проверка: RLS включен?
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'payments';
