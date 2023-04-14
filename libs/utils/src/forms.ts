import { ZodError } from 'zod';

export type FromZodError<T extends ZodError<any>> = T extends ZodError<infer U>
  ? U
  : never;

export const getErrorMessageForField = <T extends ZodError<unknown>>(
  error: T | undefined,
  field: keyof FromZodError<T>
): string | null => {
  if (error) {
    const fieldError = error.issues.find((issue) => issue.path[0] === field);

    if (fieldError) {
      return fieldError.message;
    }
  }

  return null;
};
