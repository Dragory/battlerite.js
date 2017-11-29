import { Entity } from "./Entity";
import { Player } from "./Player";
import { getChampionById, IChampion } from "../data/champions";

export class Participant extends Entity {
  public actor: string;
  public champion: IChampion;
  public stats: {
    abilityUses: number;
    attachment: number;
    damageDone: number;
    damageReceived: number;
    deaths: number;
    disablesDone: number;
    disablesReceived: number;
    emote: number;
    energyGained: number;
    energyUsed: number;
    healingDone: number;
    healingReceived: number;
    kills: number;
    mount: number;
    outfit: number;
    score: number;
    side: number;
    timeAlive: number;
    userID: string;
  };

  player: Player;

  _set(key, value) {
    if (key === "actor") {
      // Actor = champion ID. Use this to find and set the champion object.
      super._set("champion", getChampionById(value));
    }

    super._set(key, value);
  }

  _getRelationships() {
    return {
      player: Player
    };
  }
}
