'use client'

interface FormErrorProps {
  message?: string
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1 text-xs text-red-400">
      {message}
    </p>
  )
}
