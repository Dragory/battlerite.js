import { Entity } from "./Entity";
import { Roster } from "./Roster";
import { Round } from "./Round";
import { Asset } from "./Asset";
import { getMapById, IMap } from "../maps";

export class Match extends Entity {
  public createdAt: Date;
  public duration: number;
  public gameMode: string;
  public patchVersion: string;
  public shardId: string;
  public stats: any;
  public map: IMap;

  assets: Asset[];
  rosters: Roster[];
  rounds: Round[];

  _set(key, value) {
    if (key === "createdAt") {
      // Convert createdAt to a proper date
      value = new Date(value);
    } else if (key === "rounds") {
      // Order rounds by their ordinal
      (value as Round[]).sort((a, b) => {
        if (a.ordinal > b.ordinal) return 1;
        if (a.ordinal < b.ordinal) return -1;
        return 0;
      });
    } else if (key === "stats") {
      // Match stats contain the map ID. Use this to find and set the match's map.
      super("map", getMapById(value.mapID));
    }

    super._set(key, value);
  }

  _getRelationships() {
    return {
      assets: Asset,
      rosters: Roster,
      rounds: Round,
      spectators: null
    };
  }
}
