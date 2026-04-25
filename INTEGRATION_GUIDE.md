# 🔗 Интеграция системы авторизации в demo-form

## Вариант 1: Минимальная интеграция (рекомендуется)

Ваш текущий `demo-form.tsx` уже имеет систему лимитов. Нужно только:

### 1. Обновить API endpoint `/api/generate`

Добавьте проверку Supabase Auth в `app/api/generate/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  // Проверяем авторизацию
  const authHeader = request.headers.get('authorization')
  let userId: string | null = null
  let isPro = false

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    
    if (user) {
      userId = user.id
      
      // Получаем профиль
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        isPro = profile.pro_until && new Date(profile.pro_until) > new Date()
        
        // Проверяем лимит для не-PRO
        if (!isPro && profile.generations_left <= 0) {
          return NextResponse.json(
            { success: false, error: 'Лимит исчерпан' },
            { status: 429 }
          )
        }
      }
    }
  }

  // ... ваш существующий код генерации ...

  // После успешной генерации уменьшаем счётчик
  if (userId && !isPro) {
    await supabase
      .from('profiles')
      .update({ 
        generations_left: supabase.raw('generations_left - 1') 
      })
      .eq('id', userId)
  }

  return NextResponse.json({ success: true, data: result })
}
```

### 2. Обновить demo-form для получения токена

В `demo-form.tsx` замените получение токена:

```typescript
// Вместо localStorage.getItem('descro_token')
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// При запросе
const headers: HeadersInit = { "Content-Type": "application/json" }
if (token) {
  headers.Authorization = `Bearer ${token}`
}
```

### 3. Добавьте кнопку входа

В `demo-form.tsx` добавьте:

```typescript
import { AuthModal } from '@/components/auth-modal'

// В компоненте
const [showAuthModal, setShowAuthModal] = useState(false)

// В JSX перед формой
<AuthModal
  isOpen={showAuthModal}
  onClose={() => setShowAuthModal(false)}
  botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''}
/>

// Кнопка входа (если не авторизован)
{!user && (
  <button
    onClick={() => setShowAuthModal(true)}
    className="text-sm text-white/60 hover:text-white"
  >
    Войти для безлимита
  </button>
)}
```

## Вариант 2: Полная замена (если хотите новую систему)

Используйте компонент `GenerationLimiter`:

```typescript
import { GenerationLimiter } from '@/components/generation-limiter'

export function Hero() {
  return (
    <GenerationLimiter
      botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''}
      onGenerationAttempt={async () => {
        // Ваша логика генерации
        return true // или false если ошибка
      }}
    >
      <DemoForm />
    </GenerationLimiter>
  )
}
```

## Вариант 3: Использование хука useAuth

Самый гибкий вариант:

```typescript
import { useAuth } from '@/hooks/use-auth'

export function DemoForm() {
  const { user, profile, isPro, generationsLeft, refreshProfile } = useAuth()

  // Проверка лимита
  if (!isPro && generationsLeft <= 0) {
    return <PaywallScreen />
  }

  // После успешной генерации
  await refreshProfile()
}
```

## 🎯 Рекомендация

Используйте **Вариант 1** - он минимально изменяет ваш существующий код и просто добавляет Supabase Auth вместо вашей текущей системы токенов.

Основные изменения:
1. ✅ Замените `localStorage.getItem('descro_token')` на `supabase.auth.getSession()`
2. ✅ Обновите `/api/generate` для проверки Supabase токенов
3. ✅ Добавьте `<AuthModal>` для входа
4. ✅ Замените проверку PRO на `profile.pro_until`

Всё остальное работает как есть!
