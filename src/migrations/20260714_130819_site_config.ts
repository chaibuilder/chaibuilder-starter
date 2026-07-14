import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_config\` ADD \`head_h_t_m_l\` text;`)
  await db.run(sql`ALTER TABLE \`site_config\` ADD \`footer_h_t_m_l\` text;`)
  await db.run(sql`ALTER TABLE \`site_config\` ADD \`google_tag_manager_id\` text;`)
  await db.run(sql`ALTER TABLE \`site_config\` ADD \`google_analytics_id\` text;`)
  await db.run(sql`ALTER TABLE \`site_config\` ADD \`meta_pixel_id\` text;`)
  await db.run(sql`ALTER TABLE \`site_config\` ADD \`clarity_project_id\` text;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` ADD \`version_head_h_t_m_l\` text;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` ADD \`version_footer_h_t_m_l\` text;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` ADD \`version_google_tag_manager_id\` text;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` ADD \`version_google_analytics_id\` text;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` ADD \`version_meta_pixel_id\` text;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` ADD \`version_clarity_project_id\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_config\` DROP COLUMN \`head_h_t_m_l\`;`)
  await db.run(sql`ALTER TABLE \`site_config\` DROP COLUMN \`footer_h_t_m_l\`;`)
  await db.run(sql`ALTER TABLE \`site_config\` DROP COLUMN \`google_tag_manager_id\`;`)
  await db.run(sql`ALTER TABLE \`site_config\` DROP COLUMN \`google_analytics_id\`;`)
  await db.run(sql`ALTER TABLE \`site_config\` DROP COLUMN \`meta_pixel_id\`;`)
  await db.run(sql`ALTER TABLE \`site_config\` DROP COLUMN \`clarity_project_id\`;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` DROP COLUMN \`version_head_h_t_m_l\`;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` DROP COLUMN \`version_footer_h_t_m_l\`;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` DROP COLUMN \`version_google_tag_manager_id\`;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` DROP COLUMN \`version_google_analytics_id\`;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` DROP COLUMN \`version_meta_pixel_id\`;`)
  await db.run(sql`ALTER TABLE \`_site_config_v\` DROP COLUMN \`version_clarity_project_id\`;`)
}
