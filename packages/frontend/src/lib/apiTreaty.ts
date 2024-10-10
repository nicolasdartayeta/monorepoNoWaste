import {edenTreaty} from '@elysiajs/eden';
import type { App } from '@server/src/index';

export const app = edenTreaty <App>('http://localhost:3000');
