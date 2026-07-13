'use client'

import { FieldDescription, FieldError, FieldLabel, TextInput, useConfig, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { defaultAdminUrl } from '../../admin-url'
import type { MenuPageOption } from '../page-types'

function siblingPath(path: string, fieldName: string): string {
  const parts = path.split('.')
  parts[parts.length - 1] = fieldName
  return parts.join('.')
}

export const MenuUrlField: TextFieldClientComponent = ({ field, path: pathFromProps }) => {
  const {
    value,
    setValue,
    showError,
    errorMessage,
    path,
    customComponents,
  } = useField<string>({ potentiallyStalePath: pathFromProps })

  const Description = customComponents?.Description
  const ErrorComponent = customComponents?.Error

  const { config } = useConfig()
  const defaultLocale =
    typeof config.localization === 'object' ? config.localization.defaultLocale : 'en'

  const { value: itemType } = useField<string>({
    path: siblingPath(path, 'type'),
  })

  const [pages, setPages] = useState<MenuPageOption[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const isPage = itemType === 'page'
  const isCustom = itemType === 'custom'

  useEffect(() => {
    if (!isPage) return

    let cancelled = false
    setLoading(true)
    setFetchError(null)

    fetch(defaultAdminUrl('api'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'GET_MENU_PAGES', data: { lang: defaultLocale } }),
    })
      .then(async (res) => {
        const body = (await res.json().catch(() => null)) as
          | { ok: true; data: MenuPageOption[] }
          | { ok: false; error?: { message?: string } }
          | null
        if (!res.ok || !body || body.ok === false) {
          const message =
            body && body.ok === false ? body.error?.message : undefined
          throw new Error(message ?? 'Failed to load pages')
        }
        return body.data ?? []
      })
      .then((loadedPages) => {
        if (!cancelled) setPages(loadedPages)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setFetchError(error instanceof Error ? error.message : 'Failed to load pages')
          setPages([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isPage, defaultLocale])

  useEffect(() => {
    if (!isPage || !value || pages.length === 0) return
    if (pages.some((page) => page.id === value)) return
    const legacyMatch = pages.find((page) => page.slug === value)
    if (legacyMatch) setValue(legacyMatch.id)
  }, [isPage, value, pages, setValue])

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === value || page.slug === value) ?? null,
    [pages, value],
  )

  const label = isPage ? 'Page' : isCustom ? 'URL' : field.label
  const description = isPage
    ? 'Select a ChaiBuilder page. The page ID is stored for page links.'
    : 'Internal path (e.g. /about) or full URL (e.g. https://example.com)'

  return (
    <div className="field-type text">
      <FieldLabel htmlFor={`field-${path}`} label={label} required={field.required} />
      {Description ?? <FieldDescription description={description} path={path} />}
      {isPage ? (
        <div className="menu-link-page-picker">
          <select
            id={`field-${path}`}
            className="field-type select__input"
            disabled={loading}
            value={selectedPage?.id ?? value ?? ''}
            onChange={(event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setValue(event.target.value)}
          >
            <option value="">{loading ? 'Loading pages…' : 'Select a page'}</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name} ({page.slug})
              </option>
            ))}
          </select>
          {selectedPage ? (
            <p className="field-description" style={{ marginTop: '0.5rem' }}>
              Slug: {selectedPage.slug} · ID: {selectedPage.id}
            </p>
          ) : null}
          {fetchError ? <p className="field-error">{fetchError}</p> : null}
        </div>
      ) : (
        <TextInput
          path={path}
          value={value ?? ''}
          onChange={(event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setValue(event.target.value)}
          showError={showError}
        />
      )}
      {ErrorComponent ?? (showError ? <FieldError message={errorMessage} showError={showError} /> : null)}
    </div>
  )
}
