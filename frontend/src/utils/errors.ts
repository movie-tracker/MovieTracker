import { TFunction } from "i18next";

export interface IApiError extends Error {
  message: string;
  statusCode: number;
}

export function getErrorMessage(error: Error, t: TFunction) {
  if (error.name === "API_ERROR") {
    const apiError = error as IApiError;
    return t(`api.${apiError.statusCode}`, { message: apiError.message });
  }
  return error.message;
}
