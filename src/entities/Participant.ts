import {Entity} from "./Entity";
import {Player} from "./Player";

export class Participant extends Entity {
    public actor: string;
    public stats: {
        attachment: number;
        emote: number;
        mount: number;
        outfit: number;
    };

    player: Player;

    _getRelationships() {
        return {
            player: Player
        };
    }
}