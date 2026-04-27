-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Защита данных от несанкционированного доступа
-- Выполнить в Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/sql

-- ============================================
-- 1. ТАБЛИЦА: users
-- ============================================

-- Включить RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут видеть только свои данные
CREATE POLICY "Users can view own profile" 
ON users 
FOR SELECT 
USING (id::text = current_setting('request.jwt.claims', true)::json->>'user_id');

-- Политика: пользователи могут обновлять только свои данные
CREATE POLICY "Users can update own profile" 
ON users 
FOR UPDATE 
USING (id::text = current_setting('request.jwt.claims', true)::json->>'user_id');

-- Политика: service_role может управлять всеми пользователями
CREATE POLICY "Service role can manage all users" 
ON users 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- ============================================
-- 2. ТАБЛИЦА: payments
-- ============================================

-- Включить RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут видеть только свои платежи
CREATE POLICY "Users can view own payments" 
ON payments 
FOR SELECT 
USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'user_id');

-- Политика: service_role может управлять всеми платежами (для webhook)
CREATE POLICY "Service role can manage all payments" 
ON payments 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- ============================================
-- 3. ТАБЛИЦА: generations
-- ============================================

-- Включить RLS
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут видеть только свои генерации
CREATE POLICY "Users can view own generations" 
ON generations 
FOR SELECT 
USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'user_id');

-- Политика: пользователи могут удалять только свои генерации
CREATE POLICY "Users can delete own generations" 
ON generations 
FOR DELETE 
USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'user_id');

-- Политика: service_role может управлять всеми генерациями
CREATE POLICY "Service role can manage all generations" 
ON generations 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- ============================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ============================================

-- Проверка 1: RLS включен для всех таблиц?
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'payments', 'generations');

-- Проверка 2: Все политики созданы?
SELECT schemaname, tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE tablename IN ('users', 'payments', 'generations')
ORDER BY tablename, policyname;

-- ============================================
-- ВАЖНО: ПОСЛЕ ВЫПОЛНЕНИЯ
-- ============================================
-- 1. Проверить что webhook работает (создать тестовый платеж)
-- 2. Проверить что генерации сохраняются
-- 3. Проверить что история генераций загружается
-- 4. Проверить что удаление генераций работает
