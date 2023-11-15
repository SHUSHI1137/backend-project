const { JWT_SECRET: ENV_JWT_SECRET } = process.env;

if (!ENV_JWT_SECRET)
  throw new Error("JWT_SECRET environment variable is not configured");

export const JWT_SECRET = ENV_JWT_SECRET;

export const BLACKLIST_REDIS_KEY_PREFIX = "bl";
export const BLACKLIST_REDIS_VALUE = "1";
