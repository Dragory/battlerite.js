import {apiRequest} from "./request";

export class Client {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    async getPlayersByName(names: string|string[]) {
        const namesArr: string[] = Array.isArray(names) ? names : [names];
        const response = await apiRequest(this.token, 'GET', 'players', {
            'filter[playerNames]': namesArr.join(',')
        })

        console.log(response);
    }
}
