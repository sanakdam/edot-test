import {Request} from 'express';
import {checkSchema, Schema, ValidationError} from 'express-validator';

export type Validation = {
  field: string;
  value: string;
  message: string;
};

export async function validator(
  req: Request,
  schema: Schema
): Promise<ValidationError | null> {
  const checks = await checkSchema(schema).run(req);

  for (const check of checks) {
    const result = check.array();

    if (result.length > 0) {
      return result[0];
    }
  }

  return null;
}
