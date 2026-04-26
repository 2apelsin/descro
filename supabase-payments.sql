-- Таблица для хранения платежей
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL UNIQUE, -- ID платежа из ЮKassa
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL, -- pending, succeeded, canceled, refunded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Комментарии
COMMENT ON TABLE payments IS 'История платежей пользователей';
COMMENT ON COLUMN payments.payment_id IS 'ID платежа из ЮKassa';
COMMENT ON COLUMN payments.status IS 'Статус: pending, succeeded, canceled, refunded';
