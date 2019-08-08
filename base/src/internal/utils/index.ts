/**
 * DO NOT EDIT
 * AUTO-GENERATED FILE
 * This file was generated with 'design-first'
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const Validate = async <T>(type: any, payload: any, skipMissingProperties = false): Promise<string | void> => {
  let errors: ValidationError[] | void;
  errors = await validate(plainToClass(type, payload), { skipMissingProperties }); // note: this throws

  if (errors && errors.length > 0) {
    return errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
  }
}

export class HttpReturn {
  constructor(public status: number, public body: any) {}
}
