/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export type AnyConstructor = {
  new (...args: any[]): any;
};

// interface EnrichedErrorInstance {
//   previousError?: EnrichedErrorInstance | Error;
//   message: string;

//   details: {[key: string]: any};

//   getCause(): Error | undefined;
//   getRootCause(): Error | undefined;
//   getPreviousErrors(): Error[];
//   name: string;
// }

// interface EnrichedErrorConstructor<T extends EnrichedErrorInstance> {
//   new (...args: any[]): T;

//   wrap<C extends EnrichedErrorConstructor<T>>(
//     this: EnrichedErrorConstructor<T>,
//     error: Error,
//     ...rest: Parameters<C["create"]>
//   ): InstanceType<C>;

//   create<C extends EnrichedErrorConstructor<T>>(
//     this: C,
//     message?: string,
//     overrides?: Partial<InstanceType<C>>
//   ): InstanceType<C>;
// }

export function asDomainErrorBaseClass<T extends AnyConstructor>(BaseError: T) {
  class BaseDomainError extends BaseError {
    previousError?: BaseDomainError | Error;
    message: string;

    details: {[key: string]: any} = {};

    getCause(): Error | undefined {
      return this.previousError;
    }

    getRootCause(): Error | undefined {
      const previousErrors = this.getPreviousErrors();
      return previousErrors[previousErrors.length - 1];
    }

    getPreviousErrors(): Error[] {
      const {previousError} = this;
      if (!previousError) return [];
      if (previousError instanceof BaseDomainError) {
        return [previousError, ...(previousError as any).getPreviousErrors()];
      }
      return [previousError];
    }

    get name(): string {
      return this.previousError
        ? `${this._name}(${this.previousError.name})`
        : this._name;
    }

    private get _name(): string {
      return this.constructor.name;
    }

    toString(): string {
      const currentErrorString = `${this._name}: ${this.message}`;
      return this.previousError
        ? `${currentErrorString}\n\t${this.previousError.toString()}`
        : currentErrorString;
    }

    static wrap<T extends {create: (...args: any) => any} & AnyConstructor>(
      this: T,
      error: Error,
      ...rest: Parameters<T["create"]>
    ): InstanceType<T> {
      const domainError = this.create(...(rest as any));
      domainError.previousError = error;
      if (!domainError.message) {
        domainError.message = error.message;
      }
      return domainError;
    }

    static create<T extends AnyConstructor>(
      this: T,
      message?: string,
      overrides?: Partial<InstanceType<T>>
    ): InstanceType<T> {
      const error = new this(message) as InstanceType<T>;
      if (overrides) {
        Object.assign(error, overrides);
      }
      return error;
    }
  }
  return BaseDomainError as typeof BaseDomainError;
}

export const DomainError = asDomainErrorBaseClass(Error);
