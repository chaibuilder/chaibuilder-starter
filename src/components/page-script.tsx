import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import config from '@chaibuilder-config'
import Script from 'next/script'
import { getChaiBuilder } from 'chaipro/nextjs/server'

export const PageScripts = async () => {
  const cb = await getChaiBuilder(config)
  const siteSettings = await cb.getSiteSettings()
  const locale = siteSettings.fallbackLang || 'en'
  const siteConfig = await cb.getSiteGlobalData(locale)

  return (
    <>
      {siteConfig.metaPixelId && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${JSON.stringify(siteConfig.metaPixelId)});
            fbq('track', 'PageView');
          `,
          }}
        />
      )}
      {typeof siteConfig.googleTagManagerId === 'string' && (
        <GoogleTagManager gtmId={siteConfig.googleTagManagerId} />
      )}
      {typeof siteConfig.googleAnalyticsId === 'string' && (
        <GoogleAnalytics gaId={siteConfig.googleAnalyticsId} />
      )}
      {typeof siteConfig.clarityProjectId === 'string' && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", ${JSON.stringify(siteConfig.clarityProjectId)});
          `,
          }}
        />
      )}
      {siteConfig.footerHTML && (
        <div dangerouslySetInnerHTML={{ __html: siteConfig.footerHTML as string }} />
      )}
    </>
  )
}
