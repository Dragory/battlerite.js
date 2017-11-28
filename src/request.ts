import * as request from "request-promise-native";

const root = "https://api.dc01.gamelockerapp.com/shards/global";

export interface IAPIRequestParams {
  [key: string]: any;
}

export type APIMethod = "POST" | "GET";

export class APIError extends Error {}

export interface IData {
  id: string;
  attributes?: any;
  relationships?: any;
  [key: string]: any;
}

export interface IResponseData {
  data: IData[];
  included?: any[];
  meta?: any;
  [key: string]: any;
}

const resetTimeInMs = resetTime => {
  return Math.ceil(parseInt(resetTime, 10) / 1000);
};

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

let rateLimitWait: Promise<any> = Promise.resolve();

export async function rawRequest(method, url, opts = {}): Promise<any> {
  const defaultOpts = {
    uri: url,
    method,
    followRedirect: true,
    headers: {
      Accept: "application/vnd.api+json"
    },
    json: true,
    resolveWithFullResponse: true
  };

  const fullOpts = Object.assign({}, defaultOpts, opts);

  return request(fullOpts);
}

export async function apiRequest(
  token: string,
  method: APIMethod,
  endpoint: string,
  params: IAPIRequestParams = {}
): Promise<IResponseData> {
  await rateLimitWait;

  const url = `${root}/${endpoint}`;

  const opts: any = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.api+json"
    }
  };

  if (method === "GET") {
    opts.qs = params;
  } else if (method === "POST") {
    opts.body = params;
  }

  let response: IResponseData;
  try {
    response = await rawRequest(method, url, opts);
  } catch (e) {
    if (e.statusCode && e.statusCode === 404) {
      throw new APIError(`404 Not Found: ${url}`);
    } else if (e.statusCode && e.statusCode === 429) {
      // If we were rate limited (despite efforts to avoid it later below),
      // warn the user and wait until the rate limit has been reset

      // tslint:disable-next-line
      console.warn("[WARN] Rate limited, waiting");

      const resetInMs = resetTimeInMs(response.headers["x-ratelimit-reset"]);
      rateLimitWait = sleep(resetInMs);

      // Repeat the request after our rate limit has been reset
      return apiRequest(token, method, endpoint, params);
    } else if (e.error && e.error[0] === "{") {
      // Specific API error, pass to user
      const parsed = JSON.parse(e.error);
      const errors = parsed.errors
        .map(e => {
          if (e.description) {
            return `${e.title}: ${e.description}`;
          } else {
            return e.title;
          }
        })
        .join(", ");

      throw new APIError(errors);
    } else {
      // Re-throw other errors
      throw e;
    }
  }

  // Try to avoid hitting the API if we're going to be rate limited
  if (response.headers["x-ratelimit-remaining"] === "0") {
    const resetInMs = resetTimeInMs(response.headers["x-ratelimit-reset"]);
    rateLimitWait = sleep(resetInMs);
  }

  return response.body;
}

export async function apiRequestPaged(
  token: string,
  method: APIMethod,
  endpoint: string,
  params: IAPIRequestParams,
  amount: number
): Promise<IResponseData> {
  const perPage = Math.min(5, amount);
  let fetched = 0;
  let page = 0;

  const combined: IResponseData = {
    data: [],
    included: []
  };

  while (fetched < amount) {
    const thisParams = Object.assign({}, params, {
      "page[offset]": page,
      "page[limit]": perPage
    });
    const response = await apiRequest(token, method, endpoint, thisParams);

    combined.data.push(...response.data);
    combined.included.push(...response.included);

    fetched += perPage;
    page++;
  }

  return combined;
}
