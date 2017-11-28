import {apiRequest, apiRequestPaged} from "./request";
import {ensureArray, queryArray} from "./utils";
import {mapDataToEntity} from "./entityMapper";

import {Match} from "./entities/Match";
import {Player} from "./entities/Player";

export class Client {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    async getPlayersByName(names: string|string[]) {
        const namesArr: string[] = ensureArray(names);
        const response = await apiRequest(this.token, 'GET', 'players', {
            'filter[playerNames]': namesArr.join(',')
        })

        return mapDataToEntity(response.data, response.included, Player);
    }

    async searchMatches(filters: any = {}, amount = 5, sort = 'createdAt') {
        filters = filters || {};

        const params = {};

        if (filters.playerIds) {
            params['filter[playerIds]'] = queryArray(filters.playerIds);
        }

        if (filters.playerNames) {
            params['filter[playerNames]'] = queryArray(filters.playerNames);
        }

        if (filters.teamNames) {
            params['filter[teamNames]'] = queryArray(filters.teamNames);
        }

        if (filters.gamemode) {
            params['filter[gamemode]'] = queryArray(filters.gamemode);
        }

        if (filters.fromDate) {
            params['filter[createdAt-start]'] = (typeof filters.fromDate === 'string' ? filters.fromDate : (filters.fromDate as Date).toISOString());
        }

        if (filters.toDate) {
            params['filter[createdAt-start]'] = (typeof filters.toDate === 'string' ? filters.toDate : (filters.fromDate as Date).toISOString());
        }

        const response = await apiRequestPaged(this.token, 'GET', 'matches', params, amount);

        return mapDataToEntity(response.data, response.included, Match);
    }
}
