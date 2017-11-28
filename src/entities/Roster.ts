import {Entity} from "./Entity";
import {Participant} from "./Participant";

export class Roster extends Entity {
    public stats: {
        score: number;
        side: number;
    };

    public won: boolean;

    _set(key, value) {
        if (key === 'won') {
            value = (value === 'true' ? true : false);
        }

        super._set(key, value);
    }

    _getRelationships() {
        return {
            participants: Participant,
            team: null
        };
    }
}