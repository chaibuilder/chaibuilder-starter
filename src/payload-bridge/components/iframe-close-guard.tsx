'use client'

import {
  ConfirmationModal,
  useAuth,
  useForm,
  useFormModified,
  useModal,
  useTranslation,
} from '@payloadcms/ui'
import { useCallback, useEffect, useRef } from 'react'
import { registerCloseGuard } from '@/lib/iframe-comms/child'

const leaveWithoutSavingModalSlug = 'leave-without-saving-embed-close'

/**
 * Handles parent-initiated close of the embed iframe.
 * Shows Payload's leave-without-saving confirmation when the document form is dirty.
 */
export function IframeCloseGuard() {
  const { t } = useTranslation()
  const { openModal, closeModal } = useModal()
  const modified = useFormModified()
  const { isValid } = useForm()
  const { user } = useAuth()
  const resolverRef = useRef<((allowed: boolean) => void) | null>(null)
  const preventRef = useRef(false)

  preventRef.current = Boolean((modified || !isValid) && user)

  const resolvePending = useCallback((allowed: boolean) => {
    resolverRef.current?.(allowed)
    resolverRef.current = null
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) {
      return
    }

    registerCloseGuard(async () => {
      if (!preventRef.current) {
        return true
      }

      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
        openModal(leaveWithoutSavingModalSlug)
      })
    })

    return () => {
      registerCloseGuard(null)
      resolvePending(true)
    }
  }, [openModal, resolvePending])

  return (
    <ConfirmationModal
      body={t('general:changesNotSaved')}
      cancelLabel={t('general:stayOnThisPage')}
      confirmLabel={t('general:leaveAnyway')}
      heading={t('general:leaveWithoutSaving')}
      modalSlug={leaveWithoutSavingModalSlug}
      onCancel={() => {
        closeModal(leaveWithoutSavingModalSlug)
        resolvePending(false)
      }}
      onConfirm={() => {
        closeModal(leaveWithoutSavingModalSlug)
        resolvePending(true)
      }}
    />
  )
}

export default IframeCloseGuard
