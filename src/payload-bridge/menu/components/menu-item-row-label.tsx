'use client'

import { useRowLabel } from '@payloadcms/ui'

const TYPE_LABELS: Record<string, string> = {
  page: 'Page',
  custom: 'Custom',
  'submenu-trigger': 'Submenu Trigger',
  label: 'Label',
  divider: 'Divider',
}

export function MenuItemRowLabel() {
  const { data } = useRowLabel<{ type?: string; label?: string; url?: string }>()

  const type = data?.type ?? 'item'
  const typeLabel = TYPE_LABELS[type] ?? type

  if (type === 'divider') {
    return <span>Divider</span>
  }

  const label = typeof data?.label === 'string' ? data.label.trim() : ''
  const url = typeof data?.url === 'string' ? data.url.trim() : ''

  if (label && url) {
    return (
      <span>
        {label} <span style={{ opacity: 0.6 }}>{url}</span>{' '}
        <span style={{ opacity: 0.5 }}>({typeLabel})</span>
      </span>
    )
  }

  if (label) {
    return (
      <span>
        {label} <span style={{ opacity: 0.5 }}>({typeLabel})</span>
      </span>
    )
  }

  return <span>{typeLabel}</span>
}
