/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Will always return the same value given any arguments
 *
 * Throwing an exception inside the method will prevent the method from being memoized.
 */
export function All() {
  return (__: Object, _: string, d: TypedPropertyDescriptor<any>) => {
    if (d.value != null) {
      d.value = impl(d.value);
    } else if (d.get != null) {
      d.get = impl(d.get);
    } else {
      throw "Decorator can only be applied to a method or getter";
    }
  };
}
const getCacheKey = (name: string) => `__designed_memoize_all_${name}`;

All.bust = (instance: Object, name: string) => {
  if (instance.hasOwnProperty(getCacheKey(name))) {
    delete (<any>instance)[getCacheKey(name)];
  }
};

function impl(original: () => any) {
  const name = original.name;
  const cacheProp = getCacheKey(name);

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
