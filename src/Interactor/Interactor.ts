/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Base} from "../Entity";

const alreadyInstantiated = new WeakMap();

const INTERACTOR_CONFIG_KEY = Symbol("INTERACTOR_CONFIG_KEY");

class InteractorConfig {
  constructor(public proto: Object) {}

  private cleanupMethods = new Map<string, Function[]>();
  private errorMethods = new Map<string, Function[]>();
  private setupMethods = new Map<string, Function[]>();
  private afterMethods = new Map<string, Function[]>();

  hasErrorMethod({scope = "all"}: ScopeArgs) {
    return this.errorMethods.has(scope);
  }
  eachErrorMethod(
    method: (error: Function) => any,
    {scope = "all"}: ScopeArgs
  ) {
    return (this.errorMethods.get(scope) ?? []).map(method);
  }

  addErrorMethod(method: Function, {scope = "all"}: ScopeArgs) {
    this.errorMethods.set(scope, [
      ...(this.errorMethods.get(scope) ?? []),
      method
    ]);
  }

  eachSetupMethod(
    method: (setup: Function) => any,
    {scope = "all"}: ScopeArgs
  ) {
    return (this.setupMethods.get(scope) ?? []).map(method);
  }

  addSetupMethod(method: Function, {scope = "all"}: ScopeArgs) {
    this.setupMethods.set(scope, [
      ...(this.setupMethods.get(scope) ?? []),
      method
    ]);
  }

  eachAfterMethod(
    method: (after: Function) => any,
    {scope = "all"}: ScopeArgs
  ) {
    return (this.afterMethods.get(scope) ?? []).map(method);
  }

  addAfterMethod(method: Function, {scope = "all"}: ScopeArgs) {
    this.afterMethods.set(scope, [
      ...(this.afterMethods.get(scope) ?? []),
      method
    ]);
  }

  eachCleanupMethod(
    method: (cleanup: Function) => any,
    {scope = "all"}: ScopeArgs
  ) {
    return (this.cleanupMethods.get(scope) ?? []).map(method);
  }

  addCleanupMethod(method: Function, {scope = "all"}: ScopeArgs) {
    this.cleanupMethods.set(scope, [
      ...(this.cleanupMethods.get(scope) ?? []),
      method
    ]);
  }

  clone(proto: Object): InteractorConfig {
    const clone = new InteractorConfig(proto);
    clone.cleanupMethods = new Map(this.cleanupMethods);
    return clone;
  }

  static forInstance(entity: Base): InteractorConfig {
    return this.forPrototype(Object.getPrototypeOf(entity));
  }

  static forConstructor(constructor: Function): InteractorConfig {
    return this.forPrototype(constructor.prototype);
  }

  static forPrototype(proto: Object): InteractorConfig {
    const p = proto as Proto;
    let config = p[INTERACTOR_CONFIG_KEY] ?? new InteractorConfig(p);

    // Parent classes will respond with their own entity pre-existing config.
    if (config.proto !== p) {
      config = config.clone(p);
    }

    p[INTERACTOR_CONFIG_KEY] = config;
    return config;
  }
}

interface Proto {
  [INTERACTOR_CONFIG_KEY]?: InteractorConfig;
}

interface ScopeArgs {
  scope?: string;
}

type SimpleDecorator = (conf: {
  target: Object;
  interactorConfig: InteractorConfig;
  method: Function;
  descriptor: TypedPropertyDescriptor<any>;
  replaceMethod: (method: (this: any, ...args: any[]) => Promise<any>) => void;
}) => void;

function MakeDecorator(decorator: SimpleDecorator): MethodDecorator {
  return function <T>(
    target: Object,
    propertyKey: string | symbol,
    passedDescriptor: TypedPropertyDescriptor<T>
  ): void {
    const descriptor: any =
      passedDescriptor ?? Object.getOwnPropertyDescriptor(target, propertyKey);

    decorator({
      interactorConfig: InteractorConfig.forPrototype(target),
      target,
      method: descriptor.value!,
      descriptor: passedDescriptor,
      replaceMethod: (replacement) => {
        descriptor.value = replacement;
      }
    });
  };
}

/**
 * Marks a method to be run as an interactor method.
 *
 * This does some JS hackery that causes the existing instance methods that are
 * injected such as the constructor parameters to be added to a new instance and
 * the method to be called against that method.
 *
 * The inspiration for this module is https://github.com/collectiveidea/interactor
 *
 * @example
 * ```ts
 * class RegisterUser {
 *   constructor(private users: UserRepo) {}
 *   private user: User
 *   @Interactor.Method()
 *   async run(user: User) {
 *     this.user = user
 *     await this.users.save(user)
 *     return this
 *   }
 * }
 * const baseInstance = new RegisterUser(userRepo)
 * const clonedInstance = baseInstance.run(user)
 * clonedInstance !== baseInstance
 * ```
 */
export function Method(config: ScopeArgs = {}): MethodDecorator {
  return MakeDecorator(({method, interactorConfig, replaceMethod}) => {
    replaceMethod(async function (...args) {
      if (!alreadyInstantiated.has(this)) {
        const isolated = Object.create(this.constructor.prototype);

        Object.assign(isolated, {...this});
        alreadyInstantiated.set(isolated, true);

        try {
          await Promise.all(
            interactorConfig.eachSetupMethod((m) => m.call(isolated), config)
          );

          const response = await method.call(isolated, ...args);

          await Promise.all(
            interactorConfig.eachAfterMethod((m) => m.call(isolated), config)
          );
          return response;
        } catch (e) {
          if (interactorConfig.hasErrorMethod(config)) {
            return await Promise.race(
              interactorConfig.eachErrorMethod(
                (m) => m.call(isolated, e),
                config
              )
            );
          }
          throw e;
        } finally {
          await Promise.all(
            interactorConfig.eachCleanupMethod((m) => m.call(isolated), config)
          );
        }
      } else {
        return method.bind(this)(...args);
      }
    });
  });
}

/**
 * Will run the marked callback if either the setup, handleError, after or
 * method itself rejects/throws.
 */
export function Finally(config: ScopeArgs = {}): MethodDecorator {
  return MakeDecorator(({target, method}) => {
    InteractorConfig.forPrototype(target).addCleanupMethod(method, config);
  });
}

/**
 * Is called if the setup or method calls reject/throw. Will be passed the
 * error that the rejection occurred with.
 * @example
 * ```ts
 * @Interactor.OnError()
 * private async loggit(err: Error) {
 *   console.log(err)
 * }
 * ```
 */
export function OnError(config: ScopeArgs = {}): MethodDecorator {
  return MakeDecorator(({target, method}) => {
    InteractorConfig.forPrototype(target).addErrorMethod(method, config);
  });
}

/**
 * Called before the marked method is invoked
 */
export function Before(config: ScopeArgs = {}): MethodDecorator {
  return MakeDecorator(({target, method}) => {
    InteractorConfig.forPrototype(target).addSetupMethod(method, config);
  });
}

/**
 * Called after the method has completed successfully
 */
export function OnSuccess(config: ScopeArgs = {}): MethodDecorator {
  return MakeDecorator(({target, method}) => {
    InteractorConfig.forPrototype(target).addAfterMethod(method, config);
  });
}
