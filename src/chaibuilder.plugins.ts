/**
 * The single source of truth for which ChaiBuilder server plugins this app
 * runs. Registering a plugin enables its feature; plugin options carry the
 * fine-grained config. Consumed by `chaibuilder.config.ts` (buildChaiBuilderConfig).
 *
 * Plugin tables are NOT gated here — `chaiBuilderSchemaHookSqlite` injects the
 * full ChaiBuilder schema, so every plugin's tables exist (empty when
 * unregistered) and enabling a plugin later needs no migration.
 */
import { payloadMediaPlugin } from 'chaipro/payload'
import { aiProPlugin } from 'chaipro/plugins/ai-pro/server'
import { animationPlugin } from 'chaipro/plugins/animation/server'
import { mediaSearchPlugin } from 'chaipro/plugins/media-search/server'
import { redirectsPlugin } from 'chaipro/plugins/redirects/server'
import { revisionsPlugin } from 'chaipro/plugins/revisions/server'
import { trashPlugin } from 'chaipro/plugins/trash/server'
import type { ChaiServerPlugin } from 'chaipro/types'

export const chaiServerPlugins: ChaiServerPlugin[] = [
  // Payload-backed DAM (asset actions + media trash entity). Non-Payload
  // hosts would register mediaPlugin({ storage }) instead.
  payloadMediaPlugin(),
  redirectsPlugin(),
  trashPlugin(),
  mediaSearchPlugin({
    providers: [
      {
        id: 'pexels',
        filters: {
          orientation: ['default', 'landscape', 'portrait', 'square'],
          size: ['default', 'large', 'medium', 'small'],
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
  }),
  aiProPlugin(),
  revisionsPlugin({ drafts: true, maxRevisions: 10 }),
  animationPlugin(),
  // Not registered: aiCreditsPlugin (credit billing), multilingualPlugin,
  // tenancyPlugin (core pins a single app), plansPlugin, licensingPlugin,
  // rolesPlugin (DB-backed roles), layoutPlugin, formSubmissionsPlugin
  // (this starter writes submissions to its own Payload collection).
]
