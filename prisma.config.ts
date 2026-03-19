import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // 마이그레이션용 Direct URL 사용 (Session mode)
    url: process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'],
  },
})
