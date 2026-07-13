import '@/chai-context'
import config from '@chaibuilder-config'
import { NextRequest } from 'next/server'
import { ChaiBuilderRouteProps, getChaiBuilder } from 'chaipro/nextjs/server'

export async function POST(req: NextRequest, props: ChaiBuilderRouteProps) {
  const body = await req.json()
  // ponytail: NextRequest vs package Request typing
  const cb = await getChaiBuilder(config, props, req as any)
  return cb.handleHttpAction(body)
}
