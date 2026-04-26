-- Отключаем RLS для таблицы payments (так как это служебная таблица)
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Или если хочешь оставить RLS, создай политики:
-- Разрешаем вставку для authenticated пользователей
CREATE POLICY "Allow insert for authenticated users" ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Разрешаем чтение своих платежей
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Разрешаем обновление для service role (webhook)
CREATE POLICY "Allow update for service role" ON payments
  FOR UPDATE
  TO service_role
  USING (true);
