"use client"

import { useEffect } from "react"
import { Check, X } from "lucide-react"

interface ToastProps {
  message: string
  type?: "success" | "error"
  onClose: () => void
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div
        className={`flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg ${
          type === "success"
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {type === "success" ? (
          <Check className="h-5 w-5" />
        ) : (
          <X className="h-5 w-5" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}
