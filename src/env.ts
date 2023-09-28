import { parseEnv, z, port } from 'znv';

export const Environment = loadEnvironment();

function loadEnvironment() {
  return parseEnv(process.env, {
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: port().default(3050),
    MYSQL_HOST: z.string().default('db'),
    MYSQL_PORT: port().default(3306),
    MYSQL_DATABASE: z.string().default('geoip'),
    MYSQL_USER: z.string().default('geoip'),
    MYSQL_PASSWORD: z.string().min(16),
    IPINFO_KEY: z.string(),
    CRON: z.boolean().default(false),
  });
}
