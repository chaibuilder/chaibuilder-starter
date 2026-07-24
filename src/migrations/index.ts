import * as migration_20260724_152701_initial from './20260724_152701_initial';

export const migrations = [
  {
    up: migration_20260724_152701_initial.up,
    down: migration_20260724_152701_initial.down,
    name: '20260724_152701_initial'
  },
];
