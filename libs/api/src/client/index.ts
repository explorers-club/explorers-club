import type { AppRouter } from '../router';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
export * from '../transformer';
