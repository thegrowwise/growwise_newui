'use client'

import { useMemo, useState } from 'react'
import type { FreeResource, FreeResourcesTabId } from '@/data/resources'
import { FREE_RESOURCES_TAB_IDS } from '@/data/resources'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function FreeResourcesClient({ resources }: { resources: FreeResource[] }) {
  const [activeTab, setActiveTab] = useState<FreeResourcesTabId>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<FreeResource | null>(null)
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState<'form' | 'success' | 'error'>('form')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const filtered = useMemo(() => {
    if (activeTab === 'All') return resources
    return resources.filter((r) => r.category === activeTab)
  }, [resources, activeTab])

  function openFor(resource: FreeResource) {
    setSelected(resource)
    setEmail('')
    setPhase('form')
    setErrorMessage(null)
    setModalOpen(true)
  }

  function handleOpenChange(open: boolean) {
    setModalOpen(open)
    if (!open) {
      setSelected(null)
      setPhase('form')
      setErrorMessage(null)
      setSubmitting(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const res = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resourceId: selected.id,
          driveUrl: selected.driveUrl,
        }),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        setPhase('error')
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setPhase('success')
    } catch {
      setPhase('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-10 flex flex-wrap gap-2">
        {FREE_RESOURCES_TAB_IDS.map((id) => (
          <Button
            key={id}
            type="button"
            variant={activeTab === id ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'rounded-lg font-semibold transition-colors',
              activeTab === id
                ? 'bg-[#F16112] text-white hover:bg-[#d54f0a] shadow-md border-transparent'
                : 'border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-[#1F396D]/25',
            )}
            onClick={() => setActiveTab(id)}
          >
            {id}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-center py-12 rounded-xl border border-gray-100 bg-white shadow-md">
          No resources in this category yet. Try another filter.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Card
              key={r.id}
              className="flex flex-col h-full rounded-xl border border-gray-100 bg-white card-base card-hover shadow-lg"
            >
              <CardHeader className="card-padding-sm pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-bold text-strong leading-snug">
                    {r.name}
                  </CardTitle>
                  <span className="shrink-0 rounded-lg bg-[#1F396D]/10 px-2.5 py-1 text-xs font-semibold text-[#1F396D]">
                    {r.grade}
                  </span>
                </div>
                <CardDescription className="text-muted pt-1">{r.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="card-padding-sm pt-0">
                <Button
                  type="button"
                  className="w-full h-11 rounded-lg bg-[#F16112] font-semibold text-white hover:bg-[#d54f0a] shadow-md transition-all"
                  onClick={() => openFor(r)}
                >
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md rounded-xl border-2 border-gray-200 shadow-xl"
          aria-describedby="free-resource-modal-desc"
        >
          <DialogHeader>
            <DialogTitle className="text-strong text-xl">
              {phase === 'success' ? "You're all set" : 'Get the link by email'}
            </DialogTitle>
            <DialogDescription id="free-resource-modal-desc" className="text-muted">
              {selected && phase !== 'success'
                ? `We’ll send “${selected.name}” to your inbox.`
                : phase === 'success'
                  ? 'Check your email!'
                  : ''}
            </DialogDescription>
          </DialogHeader>

          {phase === 'success' ? (
            <p className="text-center text-lg font-semibold text-strong py-2">Check your email!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="free-resource-email" className="text-strong">
                  Email
                </Label>
                <Input
                  id="free-resource-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  disabled={submitting}
                  required
                  className="h-11 rounded-lg border-gray-300 focus-visible:ring-[#1F396D]/30"
                />
              </div>
              {phase === 'error' && errorMessage ? (
                <p className="text-sm text-red-600" role="alert">
                  {errorMessage}
                </p>
              ) : null}
              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#F16112] font-semibold text-white hover:bg-[#d54f0a] shadow-md"
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Send me the link'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
