'use client'

import { useEffect, useRef } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { ACTIONS } from '@/lib/chai/actions'
import type { CmsActionEvent } from '@/lib/iframe-comms'
import { emitCmsAction } from '@/lib/iframe-comms/child'

/**
 * Safely converts a document ID to a string.
 */
const stringifyId = (id: string | number | null | undefined): string | undefined => {
  return id != null ? String(id) : undefined
}

/**
 * Determines if the current update is just the initial data load for an existing document.
 */
const isInitialDataLoad = (
  previousUpdateTime: number | undefined,
  isExistingDoc: boolean,
): boolean => {
  return previousUpdateTime === undefined && isExistingDoc
}

/**
 * Determines whether the save event represents a creation or an update.
 */
const determineActionType = (
  globalSlug: string | undefined,
  previousUpdateTime: number | undefined,
): 'create' | 'update' => {
  const isCreateAction = !globalSlug && previousUpdateTime === undefined
  return isCreateAction ? 'create' : 'update'
}

/**
 * Resolves the correct query keys to invalidate based on the document type and action.
 */
const getInvalidateKeys = (
  collectionSlug: string | undefined,
  globalSlug: string | undefined,
  type: 'create' | 'update',
) => {
  if (globalSlug || collectionSlug === 'site-config') {
    return [ACTIONS.GET_SITE_GLOBAL_DATA, ACTIONS.GET_PAGE_ALL_DATA]
  }
  if (type === 'create') return [ACTIONS.GET_DYNAMIC_PAGES]
  return [ACTIONS.GET_DYNAMIC_PAGES, ACTIONS.GET_BUILDER_PAGE_DATA]
}

/**
 * Assembles the full event payload to send to the parent iframe.
 */
const buildActionPayload = ({
  id,
  collectionSlug,
  globalSlug,
  type,
  data,
}: {
  id: string | number | null | undefined
  collectionSlug: string | undefined
  globalSlug: string | undefined
  type: 'create' | 'update'
  data: any
}): CmsActionEvent => {
  const documentId = stringifyId(id)
  const method = type === 'create' ? 'POST' : 'PATCH'
  const timestamp = new Date().toISOString()
  const path =
    typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : ''

  return {
    actionType: 'invalidate',
    type,
    collection: collectionSlug || globalSlug || '',
    documentId,
    method,
    path,
    timestamp,
    data,
    keys: getInvalidateKeys(collectionSlug, globalSlug, type),
  }
}

/**
 * Detects document save events in the Payload admin and notifies the parent
 * ChaiBuilder iframe with the updated document data.
 */
export const IframeNotifier = () => {
  const { id, collectionSlug, globalSlug, lastUpdateTime, data } = useDocumentInfo()

  const previousUpdateTimeRef = useRef<number | undefined>(undefined)
  const isInitializedRef = useRef(false)
  const isExistingDocOnMountRef = useRef(false)

  useEffect(() => {
    if (!isInitializedRef.current) {
      previousUpdateTimeRef.current = lastUpdateTime
      isExistingDocOnMountRef.current = Boolean(id || globalSlug)
      isInitializedRef.current = true
      return
    }

    const hasUpdateTimeChanged =
      typeof lastUpdateTime === 'number' && lastUpdateTime !== previousUpdateTimeRef.current
    if (!hasUpdateTimeChanged) return

    if (isInitialDataLoad(previousUpdateTimeRef.current, isExistingDocOnMountRef.current)) {
      previousUpdateTimeRef.current = lastUpdateTime
      return
    }

    const type = determineActionType(globalSlug, previousUpdateTimeRef.current)
    emitCmsAction(
      buildActionPayload({ id, collectionSlug, globalSlug, type, data }),
    )
    previousUpdateTimeRef.current = lastUpdateTime
  }, [lastUpdateTime, id, collectionSlug, globalSlug, data])

  return null
}

export default IframeNotifier
