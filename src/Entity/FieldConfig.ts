import {EntityConfig} from "./EntityConfig";

export type Enum = Object;
type TaggedUnion = {
  getTag: (raw: any) => any;
  handlers: {[K: string]: any | ((data: any, tag: any) => any)};
};

export interface FieldConfigArgs {
  /**
   * If reflect-metadata is enabled this will automatically use the type of the
   * property if it is an entity.
   *
   * If the type of the reflected entity is an array it will signal that it
   * should be deserialized into an array.
   */
  reflectedEntity?: any;
  /**
   * When an array or container type is provided this will be used as the
   * individual items or as the entity used for deserialization
   */
  entity?: any;
  /**
   * If provided this will completely replace designed's deserialization logic
   */
  deserialize?: (v: any) => any;
  /**
   * Configuration that allows a union `User | Admin` to be correctly mapped
   */
  taggedUnion?: TaggedUnion;
  /**
   * The property name returned by reflect-metadata
   */
  name: string;
  /**
   * If true the entity will always attempt to call `.map()` on this value when deserializing
   */
  iterable?: boolean;
  /**
   * Whether nulls should be mapped out when the entity is serialized
   */
  nullable?: true
}

export class FieldConfig {
  public name: string;

  public reflectedEntity: any;
  public entity?: Object;

  public nullable: boolean

  private _deserialize?: (v: any) => any;

  private iterable?: boolean;

  private taggedUnion?: TaggedUnion;

  constructor({
    name,
    entity,
    iterable,
    reflectedEntity,
    deserialize,
    taggedUnion,
    nullable
  }: FieldConfigArgs & {reflectedEntity: any}) {
    this.name = name;
    this.taggedUnion = taggedUnion;
    this.entity = entity;
    this.reflectedEntity = reflectedEntity;
    this._deserialize = deserialize;
    this.iterable = iterable;
    this.nullable = !!nullable
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(_parent: EntityConfig): void {}

  deserialize(value: Object): any {
    const entity = this.entity ?? this.reflectedEntity;
    const mapSingle = (v: Object): any => {
      if (this._deserialize) {
        return this._deserialize(v);
      }
      const {taggedUnion} = this;
      if (v != null && taggedUnion != null) {
        const tag = taggedUnion.getTag(v);
        const ent = taggedUnion.handlers[tag];
        if (!ent) {
          throw new TypeError(
            `designed deserialize error: ${tag} does not have a matching value inside of ${Object.keys(
              taggedUnion.handlers
            ).join(", ")}`
          );
        }
        if ("fromJSON" in ent) {
          return ent.fromJSON(v);
        } else {
          return ent(v, tag);
        }
      }
      if (entity && "fromJSON" in entity && v != null) {
        if (
          typeof v === "object" &&
          "constructor" in v &&
          v.constructor === entity
        ) {
          return v;
        }
        return entity.fromJSON(v);
      }
      return v;
    };
    if (value && this.isArrayLike()) {
      return (value as Array<any>).map(mapSingle);
    } else {
      return mapSingle(value);
    }
  }

  isArrayLike(): boolean {
    if (this.iterable != null) {
      return this.iterable;
    }
    if (this.reflectedEntity) {
      return (
        this.reflectedEntity === Array ||
        this.reflectedEntity.prototype instanceof Array
      );
    }
    return false;
  }

  clone(): FieldConfig {
    const {reflectedEntity, entity, name} = this;
    return new FieldConfig({
      reflectedEntity,
      entity,
      name
    });
  }
}
