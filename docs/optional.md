# Optional

AKA _Optional(Java/OOP)_ _Option(Scala/OCAML)_ _Maybe(Haskell)_

## [API Docs](tsdoc/classes/_optional_optional_.optional)

## Why is this different from other libraries?

Javascripts primary strength is its simple asynchronous code. This optional
implementation is able to map into and out of the underlying `AsyncOptional`
and `Optional` interfaces without the user needing to keep track of the async
state of execution.

Other libraries like [async-optional (also no TS
definitions)](https://www.npmjs.com/package/async-optional) require you to
define that the optional will be async up front instead of being able to map
into an async version at will.

## Why?

Applying functions to potentially null/missing values has been the bane of many
programs. The optional helps refactor potentially dangerous or verbose code
into a check free style.

```js
import { Optional } from 'designed'
import { storeUser, hashPassword, updateTimestamps, emptyUser, findUser } from './UserRepo'

function updateUserPassword(userId?: string, password: string) {
await Optional.of(userId)
		.mapAsync(findUser)
		.map(addHashedPasswordToUser(password))  // Perform a sync transformation
		.map(updateTimestamps)                   // Add a value
		.mapAsync(storeUser)                     // Store the user asynchronously
		.orElse(emptyUser())
}

updateUserPassword(undefined, '123')   // Resolves just fine
updateUserPassword(userId, '123')      // Also resolves!
```


## Public Interface

### `isPresent` / `isAbsent`

Acts as a type guard to check whether the value is present. This should always
be used before issuing `Optional.get()` to prevent throwing exceptions.

```js
if (maybeUser.isPresent()) {
  maybeUser; // PresentOptional<User>
}
```

### `filter` / `filterNot`

If the predicate is true the value will remain a `PresentOptional`.

```js
Optional.of("ABC").filter((s) => s.length > 3); // AbsentOptional<'ABC'>
Optional.of("ABC").filterNot((s) => s.length > 3); // PresentOptional<'ABC'>
```

Type narrowing is supported by supplying a [User Defined Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) as the predicate.

```js
const optional =
  Optional.of<string | number>(123) // Optional<string | number>

const isString =
  (v: Object): v is string => typeof v === 'string'

optional.filter(isString) // Optional<string>
optional.filterNot(isString) // Optional<number>
```

### `map`

Applies a function to the wrapped value if it is present. If the return value
is absent (`null` or `undefined`) it will return an AbsentOptional

```js
Optional.of("ABC")
  .map((s) => s.toLowerCase())
  .get(); // 'abc'

Optional.of < string > null.map((s) => s.toLowerCase()).orElse("not there"); // 'not there'
```

### `flatMap`

Applies a function to the wrapped value that returns another `Optional`

```js
const readFileDataAtPathIfExists = (filepath: string): Optional<Buffer> => {
  /* implement */
};

Optional.of("./realfile.md").map(readFileDataAtPathIfExists); // Optional<Optional<Buffer>>
Optional.of("./realfile.md").flatMap(readFileDataAtPathIfExists); // Optional<Buffer>
Optional.of("not a file").flatMap(readFileDataAtPathIfExists); // Optional<Buffer>
```

### `toResult`

Converts the `Optional<T>` to a `Result<T, null>`

## Zip Methods

```
404 Documentation not complete
```

## Unwrapping Methods

### `orElse`

Return the wrapped value or "else" the value passed to the function.

```
Optional.of("a string").orElse(123) // Typed: string | number Result: "a string"
Optional.empty().orElse(123) // Result: 123
```

### `orGet`

Invokes the passed method and returns its value if the optional value is absent.

```
Optional.of("a string").orElse(() => 123) // Typed: string | number Result: "a string"
```

This is particularly useful in async methods. As any value can have `await`
applied to it, you can easily setup fallback behaviour without requiring branching.

```js
await Optional.of(userId).mapAsync(findUserAsync).orElse(createUserAsync); // Will always return an `User`. createUserAsync is only invoked if the previous value is empty
```

### `orThrow`

If the value is missing, throws the error supplied by the passed function.
If an error is not returned from `orThrow` a `TypeError` will be thrown instead.

```js
Optional.empty().orThrow(() => new Error("was empty")); // throws Error
Optional.of(1).orThrow(() => new Error("was empty")); // 1
```

## Async Methods

Optionals can traverse back and forth between being in an async and sync state.
`AsyncOptional` is a `PromiseLike` class that can be `await`'ed to make your
optionals easier to use with async code.

All methods available on sync `Optional`'s are also available when the optional is async.

### `mapAsync`

Performs a similar function to the above but returns an `AsyncOptional`
depending on whether the value existed. This object is `await`'able and is used
instead of a promise.

```js
const fetchUserFromAPIById = (id: string) => fetch(/* details */);

await Optional.of("123").mapAsync(fetchUserFromAPIById).orElse("notThere"); // Fetch response

await Optional.empty().mapAsync(fetchUserFromAPIById).orElse("notThere"); // "notThere"
```

### `flatMapAsync`

Performs a similar function to `mapAsync` and `flatMap`. It expects a function
that returns a `Promise<Optional<T>>` and will flat map the `Optional<T>` into
itself.

```js
const searchForBlogPostByTitle = async (
  title: string
): Promise<Optional<BlogPost>> => {
  /* implement */
};

await Optional.of("Big Software").flatMapAsync(searchForBlogPostByTitle); // Resolves to Optional<BlogPost>

await Optional.empty().flatMapAsync(searchForBlogPostByTitle); // Also resolves to Optional<BlogPost>
```
