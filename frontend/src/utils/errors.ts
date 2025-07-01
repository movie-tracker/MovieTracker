import { TFunction } from 'i18next';

export interface IApiError extends Error {
  message: string;
  statusCode: number;
  fields?: {
    [key: string]: string;
  };
}

export function isApiError(error: Error): error is IApiError {
  return error.name === 'API_ERROR';
}

export function getErrorMessage(error: Error, t: TFunction) {
  if (error.name === 'API_ERROR') {
    const apiError = error as IApiError;
    console.log(apiError);
    return t(`api.${apiError.statusCode}`, { message: apiError.message });
  }
  return error.message;
}
