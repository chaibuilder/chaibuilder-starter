export const dynamic = 'force-dynamic'

export function GET(): Response {
  return Response.redirect(process.env.CHAI_PRO_BUY_URL ?? 'https://chaibuilder.com/pricing', 307)
}
