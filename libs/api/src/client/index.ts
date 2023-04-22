import { Unarray } from '@explorers-club/utils';
import { createTRPCReact } from '@trpc/react-query';
import { inferRouterOutputs } from '@trpc/server';
import { Observable } from '@trpc/server/observable';
import type { ApiRouter } from '../router';

export * from '../transformer';
export * from '../world';

export const trpc = createTRPCReact<ApiRouter>();

// type ReactQueryOptions = inferReactQueryProcedureOptions<ApiRouter>;
// type ApiInputs = inferRouterInputs<ApiRouter>;
export type ApiOutputs = inferRouterOutputs<ApiRouter>;

type ObservableProps<T> = T extends Observable<infer U, unknown> ? U : T;

export type EntityListEvent = ObservableProps<ApiOutputs['entity']['list']>;
// export type EntityChangeEvent = ObservableProps<
//   ApiOutputs['entity']['changes']
// >;
