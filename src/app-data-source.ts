import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'dpg-chcohoak728tp98sbf3g-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'sky_project_user',
  password: 'N29qPLjcnv6Ne6NlhmUX9D4QlySIdOxw',
  database: 'sky_project',
  synchronize: false,
  ssl: true,
  logging: true,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
})
