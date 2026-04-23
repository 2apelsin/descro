import { Shield, RefreshCw, Lock, Headphones } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Безопасные платежи",
      description: "СБП, карты РФ"
    },
    {
      icon: RefreshCw,
      title: "Возврат 100%",
      description: "В течение 7 дней"
    },
    {
      icon: Lock,
      title: "Данные защищены",
      description: "SSL шифрование"
    },
    {
      icon: Headphones,
      title: "Поддержка 24/7",
      description: "Ответим за 5 минут"
    }
  ]

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-4">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <badge.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{badge.title}</p>
                <p className="text-sm text-slate-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
