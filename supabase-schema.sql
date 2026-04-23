-- Обновляем существующую таблицу teleg
-- Добавляем недостающие колонки

ALTER TABLE public.teleg 
ADD COLUMN IF NOT EXISTS generations_left INTEGER DEFAULT 3;

ALTER TABLE public.teleg 
ADD COLUMN IF NOT EXISTS last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.teleg 
ADD COLUMN IF NOT EXISTS pro_until TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.teleg 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Делаем username nullable (может быть NULL)
ALTER TABLE public.teleg 
ALTER COLUMN username DROP NOT NULL;

-- Создаём таблицу истории генераций
CREATE TABLE IF NOT EXISTS public.generations (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES public.teleg(telegram_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);

-- RLS политики
ALTER TABLE public.teleg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Политики для service role
DROP POLICY IF EXISTS "Service role can do everything on teleg" ON public.teleg;
CREATE POLICY "Service role can do everything on teleg" ON public.teleg
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can do everything on generations" ON public.generations;
CREATE POLICY "Service role can do everything on generations" ON public.generations
  FOR ALL USING (true);
