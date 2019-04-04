import { ApiError } from 'tree-house-errors';

export const NUM_ERROR_CHECKS = 4;

export const validateError = (error: ApiError | any, status: number, code: string, message: string): void => {
  expect(error).toBeInstanceOf(Error);
  expect(error.status).toEqual(status);
  expect(error.code).toEqual(code);
  expect(error.message).toEqual(message);
};
