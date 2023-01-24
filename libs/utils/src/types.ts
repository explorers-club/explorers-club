import { Context } from 'react';

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type ContextProps<T> = T extends Context<infer U> ? U : T;
