import convict from 'convict'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))

  for (const key in envConfig) {
    process.env[key] = envConfig[key]
  }
}

const config = convict({
  app: {
    name: {
      doc: 'Name of the service',
      format: String,
      default: 'user-backend'
    },
    url: {
      doc: 'URL of the service',
      format: String,
      default: 'user-backend:8003',
      env: 'APP_URL'
    },
    appName: {
      doc: 'Name of the application',
      format: String,
      default: '',
      env: 'APP_NAME'
    },
    adminFrontendUrl: {
      doc: 'URL of the service',
      format: String,
      default: 'https://admin-staging.monkey-tilt.games',
      env: 'ADMIN_FRONTEND_URL'
    }
  },

  session: {
    secret: {
      doc: 'Session secret',
      format: String,
      default: 'secret',
      env: 'SESSION_SECRET'
    },
    expiry: {
      doc: 'Global session expiry time in milliseconds',
      format: Number,
      default: '172800000', // 2 days
      env: 'SESSION_EXPIRY'
    }
  },

  basic_auth: {
    username: {
      doc: 'Basic Auth User Name',
      format: String,
      default: 'username',
      env: 'BASIC_AUTH_USERNAME'
    },
    password: {
      doc: 'Basic Auth User Password',
      format: String,
      default: 'password',
      env: 'BASIC_AUTH_PASSWORD'
    }
  },

  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },

  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT'
  },

  db: {
    name: {
      doc: 'Database Name',
      format: String,
      default: 'api',
      env: 'DB_NAME'
    },
    username: {
      doc: 'Database user',
      format: String,
      default: 'postgres',
      env: 'DB_USERNAME'
    },
    password: {
      doc: 'Database password',
      format: '*',
      default: 'postgres',
      env: 'DB_PASSWORD'
    },
    host: {
      doc: 'DB host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_HOST'
    },
    port: {
      doc: 'DB PORT',
      format: 'port',
      default: '5432',
      env: 'DB_PORT'
    }
  },

  slave_db: {
    name: {
      doc: 'Slave Database Name',
      format: String,
      default: 'api',
      env: 'SLAVE_DB_NAME'
    },
    username: {
      doc: 'Slave Database user',
      format: String,
      default: 'postgres',
      env: 'SLAVE_DB_USERNAME'
    },
    password: {
      doc: 'Slave Database password',
      format: '*',
      default: 'postgres',
      env: 'SLAVE_DB_PASSWORD'
    },
    host: {
      doc: 'Slave DB host',
      format: String,
      default: '127.0.0.1',
      env: 'SLAVE_DB_HOST'
    },
    port: {
      doc: 'Slave DB PORT',
      format: 'port',
      default: '5432',
      env: 'SLAVE_DB_PORT'
    }
  },

  redis_db: {
    password: {
      doc: 'Redis Database password',
      format: '*',
      default: '',
      env: 'REDIS_DB_PASSWORD'
    },
    host: {
      doc: 'Redis DB host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_DB_HOST'
    },
    port: {
      doc: 'Redis DB PORT',
      format: 'port',
      default: 6379,
      env: 'REDIS_DB_PORT'
    }
  },

  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },

  jwt: {
    loginTokenSecret: {
      doc: 'JWT Secret Key',
      format: String,
      default: 'secretkey',
      env: 'JWT_LOGIN_SECRET'
    },
    loginTokenExpiry: {
      doc: 'JWT Expiry time',
      format: String,
      default: '1d',
      env: 'JWT_LOGIN_TOKEN_EXPIRY'
    }
  },

  bcrypt: {
    hashingRounds: {
      doc: 'Bcrypt Hashing rounds',
      default: '',
      format: Number,
      env: 'HASHING_ROUNDS'
    }
  },

  swagger: {
    base_url: {
      doc: 'Base URL of the Swagger',
      default: 'localhost:8004',
      format: String,
      env: 'SWAGGER_BASE_URL'
    }
  },

  operator: {
    base_url: {
      doc: 'Base URL of the Operator',
      default: '',
      format: String,
      env: 'OPERATOR_BASE_URL'
    },
    id: {
      doc: 'Id of the Operator',
      default: '',
      format: String,
      env: 'OPERATOR_ID'
    },
    secret_key: {
      doc: 'Secret Key of the operator for signing data',
      default: '',
      format: String,
      env: 'OPERATOR_SECRET_KEY'
    },
    callback: {
      auth_url: {
        doc: 'auth callback url for the operator for auth purpose',
        default: '',
        format: String,
        env: 'OPERATOR_CALLBACK_AUTH_URL'
      },
      funds_url: {
        doc: 'funds callback url for the operator for fetching balance purpose',
        default: '',
        format: String,
        env: 'OPERATOR_CALLBACK_FUNDS_URL'
      },
      game_close_url: {
        doc: 'game close callback url for the operator for logout purpose',
        default: '',
        format: String,
        env: 'OPERATOR_CALLBACK_GAME_CLOSE_URL'
      },
      credit_url: {
        doc: 'auth callback url for the operator for credit balance',
        default: '',
        format: String,
        env: 'OPERATOR_CALLBACK_CREDIT_URL'
      },
      debit_url: {
        doc: 'auth callback url for the operator for debit balance',
        default: '',
        format: String,
        env: 'OPERATOR_CALLBACK_DEBIT_URL'
      },
      rollback_url: {
        doc: 'auth callback url for the operator for rollback balance',
        default: '',
        format: String,
        env: 'OPERATOR_CALLBACK_ROLLBACK_URL'
      }
    }
  }
})

config.validate({ allowed: 'strict' })

export default config
