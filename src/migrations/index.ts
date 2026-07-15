import * as migration_20260714_051231_initial_migration from './20260714_051231_initial_migration';
import * as migration_20260715_093513_form_submissions from './20260715_093513_form_submissions';

export const migrations = [
  {
    up: migration_20260714_051231_initial_migration.up,
    down: migration_20260714_051231_initial_migration.down,
    name: '20260714_051231_initial_migration',
  },
  {
    up: migration_20260715_093513_form_submissions.up,
    down: migration_20260715_093513_form_submissions.down,
    name: '20260715_093513_form_submissions'
  },
];
