import {Entity} from "./entities/Entity";
import {IData} from "./request";

export interface IIncludedMap {
    [id: string]: any;
}

export function mapDataToEntity(data: IData|IData[], included: any[]|IIncludedMap, targetClass: typeof Entity) {
    // If the included items are an array, turn it into an object for fast lookups
    if (Array.isArray(included)) {
        included = (included as any[]).reduce((map, item) => {
            map[`${item.type}-${item.id}`] = item;
            return map;
        }, {});
    }

    if (Array.isArray(data)) {
        return data.map(d => mapDataToEntity(d, included, targetClass));
    }

    const target: Entity = new targetClass();
    target.id = data.id;

    if (data.attributes) {
        for (const [key, value] of Object.entries(data.attributes)) {
            target._set(key, value);
        }
    }

    if (data.relationships) {
        const relationshipClasses = target._getRelationships();
        for (const [name, relData] of Object.entries(data.relationships)) {
            if (relationshipClasses[name] === null) {
                continue;
            }

            if (!relationshipClasses[name]) {
                throw new Error(`Unknown relationship: ${name} (in ${targetClass.name})`);
            }

            if (Array.isArray(relData.data)) {
                target._set(name, relData.data.map(d => {
                    const key = `${d.type}-${d.id}`;
                    return mapDataToEntity(included[key], included, relationshipClasses[name]);
                }));
            } else {
                const key = `${relData.data.type}-${relData.data.id}`;
                target._set(name, mapDataToEntity(included[key], included, relationshipClasses[name]));
            }
        }
    }

    return target;
}