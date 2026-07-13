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

  const damProps = useMemo(() => {
    return {
      searchImages: {
        providers: [
          {
            id: 'pexels',
            filters: {
              orientation: ['default', 'landscape', 'portrait', 'square'],
              size: ['default', 'large ', 'medium', 'small'],
              color: [
                'default',
                'red',
                'orange',
                'yellow',
                'green',
                'turquoise',
                'blue',
                'violet',
                'pink',
                'brown',
                'black',
                'gray',
                'white',
              ],
            },
          },
          {
            id: 'unsplash',
            filters: {
              orientation: ['default', 'landscape', 'portrait', 'squarish'],
              color: [
                'default',
                'black_and_white',
                'black',
                'white',
                'yellow',
                'orange',
                'red',
                'purple',
                'magenta',
                'green',
                'teal',
                'blue',
              ],
              order_by: ['default', 'relevant', 'latest'],
            },
          },
        ],
      },
    }
  }, [])

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
        flags={{
          dragAndDrop: true,
          ai: true,
          dam: { searchImages: true, genAI: true },
          trash: true,
          animation: true,
        }}
        ai={{
          models: [
            {
              id: 'google/gemini-3.5-flash',
              name: 'Gemini 3.5 Flash',
              provider: 'google',
              multiplier: 3,
              description: '3x Credits',
            },
            {
              id: 'google/gemini-3-flash',
              name: 'Gemini 3 Flash',
              provider: 'google',
              multiplier: 1,
              description: '1x Credits',
            },
            {
              id: 'zai/glm-5.2',
              name: 'GLM 5.2',
              provider: 'zai',
              multiplier: 3,
              description: '3x Credits',
              // text-only model — it cannot read images/files
              allowedFileTypes: [],
            },
          ],
        }}
        autoSave
        autoSaveActionsCount={5}
        getAccessToken={getAccessToken}
        apiUrl="api"
        getPreviewUrl={getPreviewUrl}
        getLiveUrl={getLiveUrl}
        // @ts-expect-error - dam props type is not compatible with ChaiWebsiteBuilder
        dam={damProps}
        onLogout={logoutUser}
      />
    </>
  )
}
