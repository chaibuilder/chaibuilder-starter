import * as migration_20260716_182540_initial from './20260716_182540_initial';
import * as migration_20260720_104628_remove_app_metadata from './20260720_104628_remove_app_metadata';

export const migrations = [
  {
    up: migration_20260716_182540_initial.up,
    down: migration_20260716_182540_initial.down,
    name: '20260716_182540_initial',
  },
  {
    up: migration_20260720_104628_remove_app_metadata.up,
    down: migration_20260720_104628_remove_app_metadata.down,
    name: '20260720_104628_remove_app_metadata'
  },
];
