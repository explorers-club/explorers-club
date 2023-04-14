import { ArchetypeBucket } from 'miniplex';
import { Context } from 'react';
import { Observable, Subject } from 'rxjs';
import { AnyStateMachine, StateMachine } from 'xstate';

export type FunctionReturningProperties<T> = {
  [K in keyof T]: () => T[K];
};

export type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type AnyFunction = (...args: any[]) => any;

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type ContextProps<T> = T extends Context<infer U> ? U : T;

export type ObservableProps<T> = T extends Observable<infer U> ? U : T;

export type StateSchemaFrom<TMachine extends AnyStateMachine> =
  TMachine extends StateMachine<
    infer _,
    infer TStateSchema,
    infer __,
    infer ___,
    infer ____,
    infer _____,
    infer ______
  >
    ? TStateSchema
    : never;

export type ValueOf<T> = T[keyof T];
export type IndexByType<T extends { type: string }> = {
  [K in T['type']]: T extends any ? (K extends T['type'] ? T : never) : never;
};

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

export type FromSubject<T extends Subject<any>> = T extends Subject<infer U>
  ? U
  : never;

export type FromArchetype<T extends ArchetypeBucket<any>> =
  T extends ArchetypeBucket<infer U> ? U : never;
