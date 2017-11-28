export interface IRelationshipMap {
    [key: string]: typeof Entity;
}

export class Entity {
    public id: string;

    _set(key, value) {
        this[key] = value;
    }

    _getRelationships(): IRelationshipMap {
        return {};
    }
}
