// From: https://github.com/supabase/supabase/discussions/7136
// Also https://github.com/supabase/supabase/discussions/619

import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
    : S;
export type SnakeToCamelCaseNested<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<
        T[K]
      >;
    }
  : T;
export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T>
        ? '_'
        : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S;

export type CamelCaseToSnakeNested<T> = T extends object
  ? {
      [K in keyof T as CamelToSnakeCase<K & string>]: CamelCaseToSnakeNested<
        T[K]
      >;
    }
  : T;

export const camelToSnake = (request: Request): RequestSnake =>
  snakecaseKeys(request);
export const snakeToCamel = (request: RequestSnake): Request =>
  camelcaseKeys(request);

export interface Request {
  id: string;
  slug: string;
}

export type RequestSnake = CamelCaseToSnakeNested<Request>;
