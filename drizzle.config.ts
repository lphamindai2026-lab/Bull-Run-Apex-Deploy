import type { Config } from 'drizzle-kit';

// Drizzle Kit config — reads DATABASE_URL from environment
// Never hardcode a database URL here
export default {
  dialect:  'postgresql',
  schema:   './src/db/schema.ts',
  out:      './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config;
