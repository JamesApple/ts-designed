import {Base} from "./Base";
import {getValue} from "./EntityMapping";
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

  // asJSON(args?: MappedSerializeArgs<T>, blob = {}) {
  //   if (args) {
  //     Object.entries(args).forEach(([field, config]) => {
  //       if(config)
  //     });
  //     // if (typeof args === "string") {
  //     //   set(blob, )
  //     // }
  //   } else {
  //   }
  //   return blob;
  // }
}

type MappedSerializeArgs<T extends Base, O extends Record<string, any>> = {
  [K in keyof WithoutFunctions<O>]?:
    | (O[K] extends Record<string, any> ? MappedSerializeArgs<T, O[K]> : string)
    | ((args: {instance: T}) => O[K]);

  // string | ((args: {instance: T}) => K[O]);
};

// type MappedSerializeArgs<T extends Base> = {
//   [K in keyof WithoutFunctions<T>]: T[K] extends Base
//     ? MappedSerializeArgs<T[K]> | ((args: {instance: T}) => T[K])
//     : string;
// };

// function set(object: Object, path: string, value: any): void {
//   const pathSegments = path.split(".");
//   let lastObject: any = object;

//   for (let i = 0; i < pathSegments.length - 1; i++) {
//     const key = pathSegments[i];
//     if (!lastObject[key]) lastObject[key] = {};
//     lastObject = lastObject[key];
//   }
//   lastObject[pathSegments.length - 1] = value;
// }
