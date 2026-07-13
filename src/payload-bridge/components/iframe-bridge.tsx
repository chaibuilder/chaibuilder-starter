'use client'

import { useEffect } from 'react'
import { connectToParentWindow, disconnectFromParent } from '@/lib/iframe-comms/child'

/**
 * IframeBridge — child-side iframe communication setup.
 *
 * Registered as a Payload admin `providers` entry so the embedded admin
 * (rendered inside the builder via the CMS switcher iframe) can talk to the
 * parent editor window. Initializes the Penpal connection on mount, tears it
 * down on unmount. A no-op when not inside an iframe.
 */
export function IframeBridge({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    // Only connect if we're inside an iframe
    if (window.parent === window) {
      return
    }

    connectToParentWindow({ debug: true })

    return () => {
      disconnectFromParent()
    }
  }, [])

  return <>{children}</>
}
