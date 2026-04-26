-- Таблица для запросов на возврат
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_refund_requests_user_id ON refund_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_payment_id ON refund_requests(payment_id);

-- Отключаем RLS для служебной таблицы
ALTER TABLE refund_requests DISABLE ROW LEVEL SECURITY;

-- Комментарии
COMMENT ON TABLE refund_requests IS 'Запросы пользователей на возврат средств';
COMMENT ON COLUMN refund_requests.status IS 'Статус: pending, approved, rejected';
