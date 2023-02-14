/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type {AsJsonResult, Attributes, Base} from ".";
import {ClassFieldReader, EntityFieldReader} from "./FieldReader";

type ListableInstance = {
  asJSON(): unknown;
};

type ListableClass = {
  fromJSON(data: any): ListableInstance;
  new (...args: any[]): ListableInstance;
};

export class List<T extends ListableInstance> extends Array<T> {
  static define<T extends ListableClass>(type: T) {
    return class extends List<InstanceType<T>> {
      static Entity: T = type;
      Entity: T = type;
    };
  }

  static Entity: ListableClass;

  Entity: ListableClass;

  static fromJSON<T extends typeof List>(this: T, list: any): InstanceType<T> {
    if (this.isArray(list[0])) {
      return this.create(list[0]);
    }
    return this.create(list);
  }

  static create<T extends typeof List>(
    this: T,
    list: Attributes<InstanceType<T["Entity"]>>[]
  ): InstanceType<T> {
    if (this.isArray(list[0])) {
      list = list[0];
    }
    return new this(
      ...(list.map((item) =>
        item instanceof this.Entity ? item : this.Entity.fromJSON(item)
      ) as any)
    ) as any;
  }

  toJSON(): AsJsonResult<T>[] {
    return this.asJSON();
  }

  asJSON(): AsJsonResult<T>[] {
    return Array.from(this).map((item) => item.asJSON() as any);
  }
}
