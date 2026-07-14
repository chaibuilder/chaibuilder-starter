import '@/chai-context'
import config from '@chaibuilder-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getChaiBuilder } from 'chaipro/nextjs/server'
import { ChaiPageCSS, RenderChaiBlocks } from 'chaipro/nextjs/render'
import { PreviewBanner } from 'chaipro/nextjs/render-client'
import { ChaiAnimationProvider } from 'chaipro/nextjs/render-client'
import { loadWebBlocks } from 'chaipro/web-blocks'
import { registerProjectFonts } from '@/fonts'
import { registerCustomBlocks } from '@/blocks'
import { ChaiCustomHtml } from '@/components/chai-custom-html'
import { PageScripts } from '@/components/page-script'

registerProjectFonts()
loadWebBlocks()
registerCustomBlocks()

export const dynamic = 'force-static'

type PageProps = {
  params: Promise<{ slug?: string[] }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSlugFromParams = (slug?: string[]) =>
  slug && slug.length > 0 ? `/${slug.join('/')}` : '/'

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { slug: slugParams } = await props.params
  const slug = getSlugFromParams(slugParams)
  const cb = await getChaiBuilder(config, props)
  const metadataPayload = await cb.getPageMetadataPayload(slug)
  return await cb.generateMetaData(metadataPayload)
}

export default async function Page(props: PageProps) {
  const { slug: slugParams } = await props.params
  const slug = getSlugFromParams(slugParams)
  const cb = await getChaiBuilder(config, props)

  const { isEnabled } = await cb.withRenderPhase('draftMode', () => draftMode())

  const { page, settings, pageData, pageProps } = await cb.getPagePayload(slug)
  const siteConfig = (pageData?.global ?? {}) as Record<string, unknown>
  const headHTML = typeof siteConfig.headHTML === 'string' ? siteConfig.headHTML : ''

  return (
    <html className={`scroll-smooth`} lang={page.lang}>
      <head>
        <ChaiPageCSS page={page} />
        {headHTML ? <ChaiCustomHtml htmlHeadString={headHTML} /> : null}
      </head>
      <body className={`font-body antialiased`}>
        <PreviewBanner show={isEnabled} />
        <ChaiAnimationProvider>
          <RenderChaiBlocks pageData={pageData} settings={settings} page={page} pageProps={pageProps} />
        </ChaiAnimationProvider>
        <PageScripts />
      </body>
    </html>
  )
}
