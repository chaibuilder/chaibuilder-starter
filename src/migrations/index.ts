import * as migration_20260724_153838_initial from './20260724_153838_initial';

export const migrations = [
  {
    up: migration_20260724_153838_initial.up,
    down: migration_20260724_153838_initial.down,
    name: '20260724_153838_initial'
  },
];
