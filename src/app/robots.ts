import type { MetadataRoute } from 'next'
import { adminUrl } from '@/utilities/adminRoute'
import { getServerSideURL } from '@/utilities/getURL'

/** Paths that must not be crawled (prefix match). Keep in sync with app route groups. */
export function getRobotsDisallowPaths(): readonly string[] {
  return [`${adminUrl()}/`, '/api/', '/next/']
}

/** @deprecated Use getRobotsDisallowPaths() for dynamic admin route support. */
export const ROBOTS_DISALLOW_PATHS = getRobotsDisallowPaths()

export function buildRobots(): MetadataRoute.Robots {
  const origin = getServerSideURL().replace(/\/$/, '')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...getRobotsDisallowPaths()],
    },
    sitemap: `${origin}/sitemap.xml`,
  }
}

export default function robots(): MetadataRoute.Robots {
  return buildRobots()
}

/** Robots rules change rarely; refresh daily. */
export const revalidate = 86400
