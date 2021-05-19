/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Will always return the same value given any arguments
 *
 * Throwing an exception inside the method will prevent the method from being memoized.
 */
export function All() {
  return (obj: Object, _: string, d: TypedPropertyDescriptor<any>) => {
    const proto = obj as Proto;
    const config = proto[MEMOIZE_CONFIGURATION_KEY] ?? {memoizers: 0};

    if (d.value != null) {
      d.value = impl(d.value, config);
    } else if (d.get != null) {
      d.get = impl(d.get, config);
    } else {
      throw "Decorator can only be applied to a method or getter";
    }
    config.memoizers += 1;
    proto[MEMOIZE_CONFIGURATION_KEY] = config;
  };
}
const getCacheKey = (name: string) => `__designed_memoize_all_${name}`;

// All.bust = (instance: Object, name: string) => {
//   if (instance.hasOwnProperty(getCacheKey(name))) {
//     delete (<any>instance)[getCacheKey(name)];
//   }
// };

function impl(original: () => any, config: MemoizeConfig) {
  const name = original.name;
  const cacheProp = getCacheKey(`${name}-${config.memoizers}`);

  return function (this: Object, ...args: any[]) {
    if (this.hasOwnProperty(cacheProp)) {
      return (<any>this)[cacheProp];
    }

    const value = original.apply(this, <any>args);

    Object.defineProperty(this, cacheProp, {
      writable: true,
      configurable: true,
      enumerable: false,
      value
    });
    return value;
  };
}

interface MemoizeConfig {
  memoizers: number;
}

export const MEMOIZE_CONFIGURATION_KEY = Symbol("MEMOIZE_CONFIGURATION");

interface Proto {
  [MEMOIZE_CONFIGURATION_KEY]?: MemoizeConfig;
}
