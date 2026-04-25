-- Простая таблица пользователей
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  generations_left INTEGER DEFAULT 3,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pro_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can do everything on users" ON public.users;
CREATE POLICY "Service role can do everything on users" ON public.users
  FOR ALL USING (true);
