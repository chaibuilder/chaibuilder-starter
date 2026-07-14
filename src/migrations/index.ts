import * as migration_20260714_051231_initial_migration from './20260714_051231_initial_migration';
import * as migration_20260714_130819_site_config from './20260714_130819_site_config';

export const migrations = [
  {
    up: migration_20260714_051231_initial_migration.up,
    down: migration_20260714_051231_initial_migration.down,
    name: '20260714_051231_initial_migration',
  },
  {
    up: migration_20260714_130819_site_config.up,
    down: migration_20260714_130819_site_config.down,
    name: '20260714_130819_site_config'
  },
];
