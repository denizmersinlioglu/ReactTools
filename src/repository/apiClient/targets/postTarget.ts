import { ApiTarget, Method, ParameterEncoding } from "../index";

export const fetchAll = (userId: string): ApiTarget => ({
  request: {
    method: Method.get,
    endPoint: "/posts",
    parameters: { userId: userId },
    encoding: ParameterEncoding.query,
  },
});

export const postTarget = {
  fetchAll,
};
