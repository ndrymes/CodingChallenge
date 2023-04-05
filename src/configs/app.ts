/* eslint no-process-env: "off" */

// NOTE: All env vars from process.env are imported as STRINGS. It is important to keep this in mind and cast your env vars as needed.

export const { NODE_ENV, APP_ENV, APP_MODE, DB_URL } = process.env;

export const SERVICE_NAME = process.env.SERVICE_NAME || 'mvp';
export const PORT = process.env.PORT || '3000';

export const NODE_KEEP_ALIVE_TIMEMOUT_MS = Number( process.env.NODE_KEEP_ALIVE_TIMEMOUT_MS ) || 65_000;

export const LAUNCH_DARKLY_SDK_KEY = process.env.LAUNCH_DARKLY_SDK_KEY || '';
export const SENTRY_DSN = process.env.SENTRY_DSN || '';

export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_LOCAL = NODE_ENV === 'local';
export const IS_TEST = NODE_ENV === 'test';
