import { Unarray } from '@explorers-club/utils';
import { createTRPCReact } from '@trpc/react-query';
import { inferRouterOutputs } from '@trpc/server';
import type { ApiRouter } from '../router';

export const trpc = createTRPCReact<ApiRouter>();
export * from '../transformer';

// type ReactQueryOptions = inferReactQueryProcedureOptions<ApiRouter>;
// type ApiInputs = inferRouterInputs<ApiRouter>;
type ApiOutputs = inferRouterOutputs<ApiRouter>;

export type Tile = Unarray<ApiOutputs['tile']['byIndex']['tiles']>;
