import dotenv from 'dotenv'

dotenv.config()

const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiration: process.env.JWT_EXPIRATION || '',
  refreshSecret: process.env.REFRESH_SECRET || '',
}

export default config
