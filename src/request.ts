import * as request from "request-promise-native";

const root = "https://api.dc01.gamelockerapp.com/shards/global";

export interface IAPIRequestParams {
    [key: string]: any
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

export async function apiRequest(token: string, method: APIMethod, endpoint: string, params: IAPIRequestParams): Promise<IResponseData> {
    const opts: any = {
        uri: `${root}/${endpoint}`,
        method,
        followRedirect: true,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.api+json'
        },
        json: true
    };

    if (method === 'GET') {
        opts.qs = params;
    } else if (method === 'POST') {
        opts.body = params;
    }

    let response;
    try {
        response = await request(opts);
    } catch (e) {
        if (e.error && e.error[0] === '{') {
            const parsed = JSON.parse(e.error);
            const errors = parsed.errors.map(e => e.title).join(', ');
            throw new APIError(errors);
        } else {
            throw e;
        }
    }

    return response;
}

export async function apiRequestPaged(token: string, method: APIMethod, endpoint: string, params: IAPIRequestParams, amount: number): Promise<IResponseData> {
    const perPage = Math.min(5, amount);
    let fetched = 0;
    let page = 0;

    const combined: IResponseData = {
        data: [],
        included: []
    };

    while (fetched < amount) {
        const thisParams = Object.assign({}, params, {
            'page[offset]': page,
            'page[limit]': perPage
        });
        const response = await apiRequest(token, method, endpoint, thisParams);

        combined.data.push(...response.data);
        combined.included.push(...response.included);

        fetched += perPage;
        page++;
    }

    return combined;
}
