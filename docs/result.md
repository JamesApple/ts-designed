# Result

AKA _Either_ _Left/Right_ _Operation_ _Result(Kotlin)_

## [API Docs](tsdoc/classes/_result_result_.result)

## Why?

Exceptions are commonplace in most codebases, this class allows "dangerous"
operations to be wrapped in a `Result<T, E>` which encapsulate the possible
errors or success states from a given method.

Typically the only time knowledge of an external package and its errors will be
encoded is when the service is first written. By defining typed exceptions you
encode information of possibly handleable errors you may otherwise feed
directly to your users.

The async version of this monad `AsyncResult<T, E>` is best described as a
promise with typed errors. The interface of the sync and async versions match
to simplify access and allow method chaining.

`Result<T, E>` is not required in all of your code and should not be overused.
It is best used at boundaries between services where retries or API changes are
solid and infrequent.

```js
// Async
await Result
  .fromPromise<User, NotFoundError | PGError>(getUser(userId))
  .map(setUser, logError);

// Sync
Result
  .fromThrowable<User, NotFoundError | PGError>(() => getUserSync(userId))
  .map(setUser, logError);
```


## Public Interface

## Instantiation Methods

### `fromThrowable`

given a function that when invoked may throw, wraps the caught error as a
`Fail<E>` and a successful completion as a `Success<T>`

```js
Result.fromThrowable<User, NotFoundError>(getUserSync) // Result<User, NotFoundError>
```

### `fromPromise`

Given a promise that rejects, will return a `Fail<E>` or if it resolves a `Success<T>`

```js
await Result.fromPromise<User, NotFoundError>(getUser) // Result<User, NotFoundError>
```

### `success`

Instantiates a `Success<T>` result

```js
Result.success('Value')
```

### `fail`

Instantiates a `Fail<E>` result

```js
Result.fail(new Error(''))
```

## Transformation Methods

### `map` / `mapFailure`

Apply the passed function to the wrapped successful or unsuccessful value and
returns a new `Result<T, E>` of the result.

```js
await Result.fromPromise(getUser).map(setUser, onError) // Result<void, void>

await Result.fromPromise(getUser).map(toViewUser).map(setUser) // Result<void, E>
```

### `tap`

The tap method is used for side effects. Similar to `.map` it takes 2 functions for `success` and `error` as arguments, but unlike `.map`, it doesn't change the `Result`. Instead, it just calls the success or failure function for its side effect and then returns the original `Result`. This is useful when you want to do something with a successful `Result` (like logging or updating an external resource) without changing the `Result` itself.

```js
await Result.fromPromise(createSubscription).tap(logMetrics)
```

### `swap`

Swaps the types `<T>` and `<E>`. If a Result is a `Success<T>` it will return a
`Fail<T>` and vice versa.

## Conversion Methods

### `toOptional` / `toOptionalFailure`

## Extraction Methods

### `getEither`

Returns `T | E` given `Result<T, E>`. Useful to merge multiple promises.

```js
await Result
  .fromPromise(sendEmail)
  .map(confirmEmailDelivery, rescheduleDelivery)
  .getEither()
```

### `getOrThrowFailure`

Returns `T` or throws `E` given `Result<T, E>`. This essentially reverses the
value having been wrapped in a result as an `AsyncResult` will be rejected and a `Result` will throw

