export abstract class Optional<T> {
  static of = <T>(
    value: T | Optional<NonNullable<T>>
  ): Optional<NonNullable<T>> => {
    if (value instanceof Optional) return value;
    return value == null
      ? new AbsentOptional<NonNullable<T>>()
      : new PresentOptional<NonNullable<T>>(value as any);
  };

  static empty = <T = unknown>(): Optional<T> => {
    return new AbsentOptional();
  };

  abstract map<X>(transform: (value: T) => X): Optional<NonNullable<X>>;

  abstract flatMap<X>(transform: (value: T) => Optional<X>): Optional<X>;

  abstract orElse(other: T): T;

  abstract orGet(supplier: () => T): T;

  abstract orThrow(errThrower: () => any): T;

  abstract toJSON(_: string): T | null;
}

class PresentOptional<T> extends Optional<T> {
  constructor(private value: T) {
    super();
  }

  map<X>(transform: (value: T) => X): Optional<NonNullable<X>> {
    return Optional.of(transform(this.value));
  }

  flatMap<X>(transform: (value: T) => Optional<X>): Optional<X> {
    return transform(this.value);
  }

  orElse(): T {
    return this.value;
  }

  orGet(): T {
    return this.value;
  }

  orThrow(): T {
    return this.value;
  }

  toJSON(): T | null {
    return this.value;
  }
}

class AbsentOptional<T> extends Optional<T> {
  constructor() {
    super();
  }

  map<X>(): Optional<X> {
    return new AbsentOptional<X>();
  }
  flatMap<X>(): Optional<X> {
    return new AbsentOptional();
  }

  orElse(other: T): T {
    return other;
  }

  orGet(supplier: () => T): T {
    return supplier();
  }

  orThrow(errThrower: () => any): T {
    errThrower();
    throw TypeError("Optional.orThrow callback did not throw");
  }

  toJSON(): T | null {
    return null;
  }
}
