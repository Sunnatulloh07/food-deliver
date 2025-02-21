import { Restaurant } from '@app/shared';

declare module 'express-serve-static-core' {
  interface Request {
    restaurant?: Restaurant;
  }
}
