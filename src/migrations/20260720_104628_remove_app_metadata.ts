import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`app_pages_metadata\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`app_pages_metadata\` (
  	\`id\` integer,
  	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
  	\`slug\` text NOT NULL,
  	\`pageId\` text,
  	\`publishedAt\` text,
  	\`pageType\` text,
  	\`pageBlocks\` text,
  	\`dataBindings\` text,
  	\`pageContent\` text,
  	\`dataProviders\` text,
  	\`app\` text NOT NULL,
  	PRIMARY KEY(\`slug\`, \`app\`)
  );
  `)
}
