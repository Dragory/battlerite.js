import { Entity } from "./Entity";

export class Asset extends Entity {
  public URL: string;
  public name: string;
  public description: string;
  public createdAt: Date;

  _set(key, value) {
    if (key === "createdAt") {
      value = new Date(value);
    }

    super._set(key, value);
  }
}
