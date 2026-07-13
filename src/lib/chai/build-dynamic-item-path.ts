/** Build public URL for a collection item from a dynamic page base slug. */
export function buildDynamicItemPath(
  base: { slug: string; dynamicSlugCustom?: string | null },
  itemSlug: string,
): string {
  const normalizedBase = base.slug.endsWith('/') ? base.slug.slice(0, -1) : base.slug
  const normalizedItem = itemSlug.replace(/^\/+/, '')
  const custom = base.dynamicSlugCustom ?? ''
  return `${normalizedBase}/${normalizedItem}${custom}`
}
