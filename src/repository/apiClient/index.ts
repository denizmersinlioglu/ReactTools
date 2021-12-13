import { config } from "../../utils/config";
import { log } from "../../utils/logger";

export type ApiTarget = {
  request: ApiRequest;
  retryCount?: number;
};

type ApiRequest = {
  method: Method;
  endPoint: string;
  parameters: Record<string, any>;
  encoding: ParameterEncoding;
};

export enum Method {
  post = "POST",
  get = "GET",
  put = "PUT",
  delete = "DELETE",
}

export enum ParameterEncoding {
  body,
  query,
}

export interface ApiError extends Error {
  title: string;
  message: string;
  type: ErrorType;
}

enum ErrorType {
  soft = 0,
  hard = 1,
}

const client = (
  baseUrl: () => string,
  accessToken: () => string,
  customHeaders: () => Record<string, string>,
  tokenUpdateHandler: (target: ApiTarget) => Promise<string>,
  invalidAuthenticationHandler: (target: ApiTarget) => Promise<void>
) => {
  const request = async (target: ApiTarget) => {
    return sendRequest(target, target.retryCount ?? 2);
  };

  const sendRequest = async (
    target: ApiTarget,
    retryCount: number
  ): Promise<any> => {
    logRequest(target);

    const req = target.request;
    const url = baseUrl() + req.endPoint;

    let headers: Record<string, string> = customHeaders();
    headers["content-type"] = "application/json";
    headers["Access-Control-Allow-Origin"] = "*";
    if (accessToken()) {
      headers["Authorization"] = `Bearer ${accessToken()}`;
    }

    try {
      const result = await (req.encoding === ParameterEncoding.query
        ? fetch(url + "?" + new URLSearchParams(req.parameters), {
            method: req.method,
            headers: headers,
          })
        : fetch(url, {
            method: req.method,
            headers: headers,
            body: JSON.stringify(req.parameters),
          }));

      const statusCode = result.status;

      if (statusCode === 403) {
        if (retryCount < 1) {
          invalidAuthenticationHandler(target);
          throw Error("Access Denied");
        } else {
          await tokenUpdateHandler(target);
          return await sendRequest(target, retryCount - 1);
        }
      }

      const data = await result.json();
      logResponse(target, data, { statusCode });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logRequest = (target: ApiTarget) => {
    log("Api Request", [
      `URL: ${baseUrl() + target.request.endPoint}`,
      `Method: ${target.request.method}`,
      `Target: ${JSON.stringify(target, null, 2)}`,
      `Parameters: ${JSON.stringify(target.request.parameters, null, 2)}`,
    ]);
  };

  const logResponse = (
    target: ApiTarget,
    data?: Record<string, any>,
    response?: { statusCode: number }
  ) => {
    log("Api Response", [
      `URL: ${baseUrl() + target.request.endPoint}`,
      `Method: ${target.request.method}`,
      `Status: ${response?.statusCode ?? 0}`,
      `Target: ${JSON.stringify(target, null, 2)}`,
      `Parameters: ${JSON.stringify(target.request.parameters, null, 2)}`,
      `Data: ${JSON.stringify(data, null, 2)}`,
    ]);
  };

  return { request };
};

export const apiClient = client(
  () => config.apiUrl,
  () => "authentication Token",
  () => ({}),
  async (_) => {
    return ""; // refreshed token
  },
  async (_) => {
    // Invalidate token
  }
);
