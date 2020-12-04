/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Base} from "./Base";
import {EntityFieldReader} from "./FieldReader";
import {WithoutFunctions} from "./utilityTypes";

type FunctionlessBase = WithoutFunctions<Base>;

export class EntitySerializer<T extends Base> {
  constructor(private instance: T) {}

  mapOut<O extends Object>(
    target: O,
    ...fields: MapOutArgs<WithoutFunctions<T>, WithoutFunctions<O>>
  ): O {
    return this.performMapOut(target, fields as any);
  }

  mapOutRaw<O extends Object>(
    ...fields: MapOutArgs<WithoutFunctions<T>, WithoutFunctions<O>>
  ): O {
    return this.performMapOut({} as O, fields as any);
  }

  private performMapOut(target: any, mappings: MapOutArgs<any, any>): any {
    const instance: any = this.instance;
    mappings.forEach((mapping) => {
      if (isSameTypeMap(mapping)) {
        target[mapping] = instance[mapping];
      } else if (isDirectMap(mapping)) {
        const {field, map} = mapping;
        target[field] = map(instance[field]);
      } else if (isIndirectMap(mapping)) {
        const {map, from} = mapping;
        const {with: mapper, to} = map;
        target[to] = mapper(instance[from]);
      }
    });
    return target;
  }

  asJSON(): AsJsonResult<T> {
    return new EntityFieldReader(this.instance).onlySet().reduce((json, f) => {
      const deserializeSingle = (v: any) => {
        if (hasAsJSONMethod(value)) {
          v = v.asJSON();
        } else if (canBeConvertedToJson(v)) {
          v = (v as any).serialize().asJSON();
        }
        return v;
      };

      let value: any = (this.instance as any)[f.name];
      if (hasAsJSONMethod(value)) {
        value = deserializeSingle(value);
      } else if (f.fieldArrayLike && value) {
        value = value.map(deserializeSingle);
      }
      json[f.name] = value;
      return json;
    }, {} as any) as any;
  }
}

function isSameTypeMap(f: any): f is string {
  return typeof f === "string";
}

function isDirectMap(f: any): f is MapDirect<any, any, any> {
  return "field" in f && "map" in f;
}

function isIndirectMap(f: any): f is MapIndirect<any, any, any, any> {
  return "from" in f && "map" in f;
}

export type MapOutArgs<
  T extends FunctionlessBase,
  O extends Object
> = MapOutArg<T, O>[];

export type MapOutArg<T extends FunctionlessBase, O extends Object> =
  | SameTypeFields<T, O>
  | MapDirect<T, O, keyof T & keyof O>
  | MapIndirect<T, O, keyof T, keyof O>;

type MapDirect<
  T extends FunctionlessBase,
  O extends Object,
  K extends keyof T & keyof O
> = {
  [MK in keyof T & keyof O]: {
    field: MK;
    map: (from: T[MK]) => O[MK];
  };
}[K];

type MapIndirect<
  T extends FunctionlessBase,
  O extends Object,
  K extends keyof T,
  OK extends keyof O
> = {
  [MK in keyof T]: {
    from: MK;
    map: {
      [MKK in keyof O]: {
        to: OK;
        with: (from: T[MK]) => O[MKK];
      };
    }[OK];
  };
}[K];

type RemoveNever<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];

type SameTypeFields<T extends FunctionlessBase, O extends Object> = RemoveNever<
  {
    [K in keyof T & keyof O]: T[K] extends O[K] ? K : never;
  }
>;

type AsJsonResult<T extends Base> = {
  [K in keyof WithoutFunctions<T>]: T[K] extends Base
    ? AsJsonResult<T[K]>
    : T[K];
};

interface ConvertableToJson<T extends Base> {
  serialize: T["serialize"];
}

interface HasAsJSONMethod {
  asJSON(data: any): any;
}

function canBeConvertedToJson<T extends Base>(
  v: any
): v is ConvertableToJson<T> {
  return v && v instanceof Base;
}

function hasAsJSONMethod(v: any): v is HasAsJSONMethod {
  return v && typeof v === "object" && "asJSON" in v;
}
