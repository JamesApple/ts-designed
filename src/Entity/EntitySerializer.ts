import {Base} from "./Base";
import {EntityFieldReader} from "./FieldReader";
import {WithoutFunctions} from "./utilityTypes";

export class EntitySerializer<T extends Base> {
  constructor(private instance: T) {}

  mapTo<O extends Record<string, any>>(
    mapping: MappedSerializeArgs<T, O>,
    target: Partial<O> = {}
  ): O {
    Object.entries(mapping).forEach(([k, config]) => {
      if (typeof config === "function") {
        (target as any)[k] = config({instance: this.instance});
      } else if (typeof config === "object") {
        if (config == null) return;
        if (target[k] == null) (target as any)[k] = {};
        this.mapTo<any>(config, target[k]);
      } else if (typeof config === "string") {
        (target as any)[k] = getValue(config, this.instance);
      }
    });
    return target as O;
  }

  asJSON(): AsJsonResult<T> {
    return new EntityFieldReader(this.instance).onlySet().reduce((json, f) => {
      let value: any = (this.instance as any)[f.name];
      if (hasAsJSONMethod(value)) {
        value = (value as any).asJSON();
      } else if (canBeConvertedToJson(value)) {
        value = (value as any).serialize().asJSON();
      }
      json[f.name] = value;
      return json;
    }, {} as any) as any;
  }
}

type AsJsonResult<T extends Base> = {
  [K in keyof WithoutFunctions<T>]: T[K] extends Base
    ? AsJsonResult<T[K]>
    : T[K];
};

type MappedSerializeArgs<T extends Base, O extends Record<string, any>> = {
  [K in keyof WithoutFunctions<O>]?:
    | (O[K] extends Record<string, any> ? MappedSerializeArgs<T, O[K]> : string)
    | ((args: {instance: T}) => O[K]);
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

function getValue(path: string, object: unknown): any {
  const value = path
    .replace(/\[/g, ".")
    .replace(/\]/g, "")
    .split(".")
    .reduce((o: any, k: string) => (o || {})[k], object) as unknown;
  if (value && typeof value === "object" && "asJSON" in value) {
    return (value as any).asJSON();
  }
  return value;
}
