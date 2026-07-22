import * as migration_20260722_061023_initial from './20260722_061023_initial';

export const migrations = [
  {
    up: migration_20260722_061023_initial.up,
    down: migration_20260722_061023_initial.down,
    name: '20260722_061023_initial'
  },
];
