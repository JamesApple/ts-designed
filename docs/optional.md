# Optional

AKA _Optional(Java/OOP)_ _Option(Scala/OCAML)_ _Maybe(Haskell)_

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

[Docs](tsdoc/classes/_optional_optional_.optional)

## Playground

<iframe height="400px" width="100%" src="https://repl.it/@JamesApple/designedOptional?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Public Interface

### `isPresent` / `isAbsent`

Used in an if statement, will guarantee the type of the optional as either present or absent

```js
if (maybeUser.isPresent()) {
  maybeUser; // Instance of PresentOptional<User>
}
```

### `filter`

If the predicate is true the value will remain a `PresentOptional`. Otherwise the value is discarded.

```js
Optional.of("ABC").filter((s) => s.length > 3); // Is now AbsentOptional<string>
```

### `map` / `flatMap`

### `mapAsync` / `flatMapAsync`
