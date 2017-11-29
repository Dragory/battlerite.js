import { Entity } from "./Entity";
import { Player } from "./Player";
import { getChampionById, IChampion } from "../champions";

export class Participant extends Entity {
  public actor: string;
  public champion: IChampion;
  public stats: {
    attachment: number;
    emote: number;
    mount: number;
    outfit: number;
  };

  player: Player;

  _set(key, value) {
    if (key === "actor") {
      // Actor = champion ID. Use this to find and set the champion object.
      super("champion", getChampionById(value));
    }

    super(key, value);
  }

  _getRelationships() {
    return {
      player: Player
    };
  }
}
