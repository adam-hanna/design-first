import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export const ValidatePayload = async <T>(
  payload: any,
  skipMissingProperties = false
): Promise<string | void> => {
  let errors: ValidationError[] | void;
  errors = await validate(payload, { skipMissingProperties }); // note: this throws

  if (errors && errors.length > 0) {
    return errors
      .map((error: ValidationError) => Object.values(error.constraints))
      .join(', ');
  }
};
