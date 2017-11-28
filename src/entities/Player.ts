import {Entity} from "./Entity";

export class Player extends Entity {
    public type: string;
    public name: string;
    public patchVersion: string;
    public shardId: string;
    public titleId: string;

    _getRelationships() {
        return {
            assets: null
        };
    }
}