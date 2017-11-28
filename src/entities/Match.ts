import {Entity} from "./Entity";
import {Roster} from "./Roster";
import {Round} from "./Round";

export class Match extends Entity {
    public createdAt: Date;
    public duration: number;
    public gameMode: string;
    public patchVersion: string;
    public shardId: string;

    rosters: Roster[];

    _set(key, value) {
        if (key === 'createdAt') {
            value = new Date(value);
        } else if (key === 'rounds') {
            (value as Round[]).sort((a, b) => {
                if (a.ordinal > b.ordinal) return 1;
                if (a.ordinal < b.ordinal) return -1;
                return 0;
            });
        }

        super._set(key, value);
    }

    _getRelationships() {
        return {
            assets: null,
            rosters: Roster,
            rounds: Round,
            spectators: null
        };
    }
}