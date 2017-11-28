import {Entity} from "./Entity";
import {Participant} from "./Participant";

export class Round extends Entity {
    public duration: number;
    public ordinal: number;
    public stats: {
        winningTeam: number
    };

    participants: Participant[];

    _getRelationships() {
        return {
            participants: Participant
        };
    }
}