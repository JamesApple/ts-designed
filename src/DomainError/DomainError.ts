/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Attributes} from "../Entity/Base";
type AnyConstructor = {
  new (...args: any[]): {message: string};
};

export class DomainError extends Error {
  readonly previousError?: DomainError | Error;
  readonly message: string;

  readonly details: {[key: string]: any} = {};

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
    if (previousError instanceof DomainError) {
      return [previousError, ...previousError.getPreviousErrors()];
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

  static wrap<T extends AnyConstructor>(
    this: T,
    error: Error,
    overrides: Partial<Attributes<InstanceType<T>>> = {}
  ): InstanceType<T> {
    const domainError = new this((overrides as any).message ?? error.message);
    Object.assign(domainError, overrides, {previousError: error});
    return domainError as any;
  }

  static create<T extends AnyConstructor>(
    this: T,
    message?: string,
    overrides: Partial<Attributes<InstanceType<T>>> = {}
  ): InstanceType<T> {
    const error = new this(message) as InstanceType<T>;
    Object.assign(error, overrides);
    return error;
  }
}
