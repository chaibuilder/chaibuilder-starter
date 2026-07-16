'use client'

import { useCallback, useMemo } from 'react'

import { defaultChaiLibrary, registerChaiLibrary } from 'chaipro'
import { ChaiWebsiteBuilder } from 'chaipro/payload/builder'
import { registerProjectFonts } from '@/fonts'
import { logoutAction } from '@/app/(builder)/admin/actions/logout'
import { adminUrl } from '@/utilities/adminRoute'
import { registerCustomBlocks } from '@/blocks'
registerProjectFonts()
registerCustomBlocks()
registerChaiLibrary('chai-library', defaultChaiLibrary())

export default function Editor({ accessToken }: { accessToken: string }) {
  const getAccessToken = useCallback(async () => accessToken, [accessToken])
  const getPreviewUrl = useCallback((path: string) => `/next/preview?path=${path}`, [])
  const getLiveUrl = useCallback((path: string) => `/next/exit-preview?path=${path}`, [])

  const logoutUser = useCallback(async () => {
    await logoutAction()
    window.location.href = adminUrl('login')
  }, [])

  return (
    <>
      <ChaiWebsiteBuilder
        onError={(error) => {
          console.error(error)
        }}
        autoSave
        autoSaveActionsCount={5}
        getAccessToken={getAccessToken}
        apiUrl="api"
        getPreviewUrl={getPreviewUrl}
        getLiveUrl={getLiveUrl}
        onLogout={logoutUser}
        currentUser={null}
      />
    </>
  )
}
