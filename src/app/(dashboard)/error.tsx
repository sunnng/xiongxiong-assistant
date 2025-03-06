'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

function ErrorPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-4">
      <AlertTriangle className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Something went wrong</p>
      <Button size="sm">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}

export default ErrorPage
