import request from "request-promise-native";

const root = "https://api.dc01.gamelockerapp.com/shards/global";

export interface IAPIRequestParams {
    [key: string]: any
}

export type APIMethod = "POST" | "GET";

export function apiRequest(token: string, method: APIMethod, endpoint: string, params: IAPIRequestParams) {
    const fullUrl = `${root}/${endpoint}`;
    const opts: any = {
        method,
        followRedirect: true,
        headers: {
            'Authorization': token
        }
    };

    if (method === 'GET') {
        opts.qs = params;
    } else if (method === 'POST') {
        opts.form = params;
    }

    return request(opts);
}