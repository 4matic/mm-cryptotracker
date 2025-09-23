"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-accent">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </Button>
  )
}
