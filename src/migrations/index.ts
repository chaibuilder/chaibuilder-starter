import * as migration_20260716_182540_initial from './20260716_182540_initial';

export const migrations = [
  {
    up: migration_20260716_182540_initial.up,
    down: migration_20260716_182540_initial.down,
    name: '20260716_182540_initial'
  },
];
