export abstract class Optional<T> {
  static of = <T>(
    value: T | Optional<NonNullable<T>>
  ): Optional<NonNullable<T>> => {
    if (value instanceof Optional) return value;
    return value == null
      ? new AbsentOptional<NonNullable<T>>()
      : new PresentOptional<NonNullable<T>>(value as any);
  };

  static fromJSON = (data: any) => Optional.of(data);

  static empty = <T = unknown>(): Optional<T> => {
    return new AbsentOptional();
  };

  abstract isPresent(): this is PresentOptional<T>;

  abstract isAbsent(): this is AbsentOptional<T>;

  abstract filter(transform: (value: T) => boolean): Optional<T>;

  abstract map<X>(transform: (value: T) => X): Optional<NonNullable<X>>;

  abstract flatMap<X>(transform: (value: T) => Optional<X>): Optional<X>;

  abstract orElse<X>(other: X): T | X;

  abstract orGet<X>(supplier: () => X): T | X;

  abstract orThrow(errThrower: () => any): T;

  abstract toJSON(_: string): T | null;

  abstract asJSON(): T | null;
}

class PresentOptional<T> extends Optional<T> {
  filter(transform: (value: T) => boolean): Optional<T> {
    return transform(this.value)
      ? new PresentOptional(this.value)
      : new AbsentOptional<T>();
  }

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

  asJSON(): T | null {
    return this.value;
  }
  isPresent(): this is PresentOptional<T> {
    return true;
  }

  isAbsent(): this is AbsentOptional<T> {
    return false;
  }
}

class AbsentOptional<T> extends Optional<T> {
  constructor() {
    super();
  }

  map<X>(): Optional<X> {
    return new AbsentOptional<X>();
  }

  filter(): Optional<T> {
    return new AbsentOptional();
  }

  flatMap<X>(): Optional<X> {
    return new AbsentOptional();
  }

  orElse<X>(other: X): T | X {
    return other;
  }

  orGet<X>(supplier: () => X): T | X {
    return supplier();
  }

  orThrow(errThrower: () => any): T {
    errThrower();
    throw TypeError("Optional.orThrow callback did not throw");
  }

  toJSON(): T | null {
    return null;
  }

  asJSON(): T | null {
    return null;
  }

  isPresent(): this is PresentOptional<T> {
    return false;
  }

  isAbsent(): this is AbsentOptional<T> {
    return true;
  }
}
