import * as migration_20260714_051231_initial_migration from './20260714_051231_initial_migration';

export const migrations = [
  {
    up: migration_20260714_051231_initial_migration.up,
    down: migration_20260714_051231_initial_migration.down,
    name: '20260714_051231_initial_migration'
  },
];
