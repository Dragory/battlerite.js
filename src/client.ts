import { APIError, apiRequest, apiRequestPaged, rawRequest } from "./request";
import { ensureArray, queryArray } from "./utils";
import { mapDataToEntity } from "./entityMapper";

import { Match } from "./entities/Match";
import { Player } from "./entities/Player";

export class Client {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getPlayer(id: string) {
    let response;
    try {
      response = await apiRequest(this.token, "GET", `players/${id}`);
    } catch (e) {
      if (e instanceof APIError && e.statusCode === 404) return null;
      else throw e;
    }

    return mapDataToEntity(response.data[0], response.included, Player);
  }

  async getPlayersById(ids: string | string[]) {
    const idsArr: string[] = ensureArray(ids);

    let response;
    try {
      response = await apiRequest(this.token, "GET", "players", {
        "filter[playerIds]": idsArr.join(",")
      });
    } catch (e) {
      if (e instanceof APIError && e.statusCode === 404) return [];
      else throw e;
    }

    return mapDataToEntity(response.data, response.included, Player);
  }

  async getPlayersByName(names: string | string[]) {
    const namesArr: string[] = ensureArray(names);

    let response;
    try {
      response = await apiRequest(this.token, "GET", "players", {
        "filter[playerNames]": namesArr.join(",")
      });
    } catch (e) {
      if (e instanceof APIError && e.statusCode === 404) return [];
      else throw e;
    }

    return mapDataToEntity(response.data, response.included, Player);
  }

  async getMatch(id: string) {
    let response;
    try {
      response = await apiRequest(this.token, "GET", `matches/${id}`);
    } catch (e) {
      if (e instanceof APIError && e.statusCode === 404) return null;
      else throw e;
    }

    return mapDataToEntity(response.data[0], response.included, Match);
  }

  async searchMatches(filters: any = {}, amount = 5, sort = "createdAt") {
    filters = filters || {};

    const params = {};

    if (filters.playerIds) {
      params["filter[playerIds]"] = queryArray(filters.playerIds);
    }

    if (filters.playerNames) {
      params["filter[playerNames]"] = queryArray(filters.playerNames);
    }

    if (filters.teamNames) {
      params["filter[teamNames]"] = queryArray(filters.teamNames);
    }

    if (filters.gamemode) {
      params["filter[gamemode]"] = queryArray(filters.gamemode);
    }

    if (filters.fromDate) {
      params["filter[createdAt-start]"] =
        typeof filters.fromDate === "string"
          ? filters.fromDate
          : (filters.fromDate as Date).toISOString();
    }

    if (filters.toDate) {
      params["filter[createdAt-end]"] =
        typeof filters.toDate === "string"
          ? filters.toDate
          : (filters.fromDate as Date).toISOString();
    }

    let response;
    try {
      response = await apiRequestPaged(
        this.token,
        "GET",
        "matches",
        params,
        amount
      );
    } catch (e) {
      if (e instanceof APIError && e.statusCode === 404) return [];
      else throw e;
    }

    return mapDataToEntity(response.data, response.included, Match);
  }

  async getMatchTelemetry(match: Match) {
    const telemetryAsset = match.assets.find(asset => {
      return asset.name === "telemetry";
    });

    if (!telemetryAsset) {
      throw new Error("Telemetry asset not found in Match!");
    }

    const response = await rawRequest("GET", telemetryAsset.URL);
    return response.body;
  }
}
