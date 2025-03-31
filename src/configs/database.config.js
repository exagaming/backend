import { Logger } from '@src/libs/logger'
import config from './app.config'

const commonSetting = {
  logging: (logs) => Logger.info('Database query', { message: logs }),
  dialect: 'postgres',
  database: config.get('db.name'),
  replication: {
    read: [
      {
        username: config.get('slave_db.username'),
        password: config.get('slave_db.password'),
        host: config.get('slave_db.host'),
        port: config.get('slave_db.port')
      }
    ],
    write: {
      username: config.get('db.username'),
      password: config.get('db.password'),
      host: config.get('db.host'),
      port: config.get('db.port')
    }
  },
  dialectOptions: {
    application_name: config.get('app.name')
  },
  define: {
    underscored: true,
    timestamps: true
  },
  pool: {
    min: 0,
    max: 200,
    idle: 5000,
    evict: 5000,
    acquire: 200000
  },
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_migration_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_seed_meta'
}

export const development = {
  ...commonSetting
}

export const test = {
  ...commonSetting
}

export const staging = {
  ...commonSetting
}

export const production = {
  ...commonSetting
}
