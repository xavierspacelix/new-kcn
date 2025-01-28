// config/session.ts
import { SessionOptions } from 'next-iron-session';

export const sessionOptions: SessionOptions = {
  cookieName: 'MY_APP_COOKIE',
  password: 'yPo4T7apfbdvctV1Bso1oAndQH9qwC94',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  // Set secure to false to allow sending cookies over HTTP (only for development)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
  },
};
