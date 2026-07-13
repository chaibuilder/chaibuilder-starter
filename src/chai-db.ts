import type { SQLiteAdapterArgs } from '@payloadcms/db-sqlite'
import { getTableName } from 'drizzle-orm'

type ChaiBuilderSchemaHook = NonNullable<SQLiteAdapterArgs['beforeSchemaInit']>[number]

function isDrizzleTable(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  try {
    const name = getTableName(value as Parameters<typeof getTableName>[0])
    return typeof name === 'string' && name.length > 0
  } catch {
    return false
  }
}

function pickTables(module: Record<string, unknown>): Record<string, unknown> {
  const tables: Record<string, unknown> = {}
  for (const [exportName, value] of Object.entries(module)) {
    if (isDrizzleTable(value)) {
      tables[exportName] = value
    }
  }
  return tables
}

/**
 * Merges ChaiBuilder SQLite tables into Payload's Drizzle schema for push/migrate.
 * ponytail: chaipro does not export schema.sqlite — borrow table map via createLibsqlDB.
 */
export const chaiBuilderSchemaHook: ChaiBuilderSchemaHook = async ({ schema }) => {
  const { createLibsqlDB } = await import('chaipro/db/libsql')
  const setup = createLibsqlDB({ url: 'file::memory:' })
  try {
    return {
      ...schema,
      tables: {
        ...schema.tables,
        ...(pickTables(setup.schema as Record<string, unknown>) as typeof schema.tables),
      },
      // ponytail: PG relations bind pg tables — leave Payload relations as-is for sqlite
      relations: schema.relations,
    }
  } finally {
    setup.teardown?.()
  }
}
