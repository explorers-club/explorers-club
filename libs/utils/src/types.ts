import { Context } from 'react';
import { Observable } from 'rxjs';

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type ContextProps<T> = T extends Context<infer U> ? U : T;

export type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;

export type FromObservable<T extends Observable<any>> = T extends Observable<
  infer U
>
  ? U
  : never;
