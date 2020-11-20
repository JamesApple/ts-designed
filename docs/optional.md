# Optional

AKA _Optional(Java/OOP)_ _Option(Scala/OCAML)_ _Maybe(Haskell)_

## Why?

Applying functions to potentially null/missing values has been the bane of many
programs. The optional helps refactor potentially dangerous or verbose code
into a check free style.

```js
import { Optional } from 'designed'
import { storeUser, hashPassword, updateTimestamps } from './UserRepo'

function updateUserPassword(user) {
	await Optional.of(user)
		.map(hashPassword)     // Perform a sync transformation
		.map(updateTimestamps) // Add a value
		.map(storeUser)        // Store the user asynchronously
		.orElse(Promise.resolve())
}

updateUserPassword(null)   // Resolves just fine
updateUserPassword(myUser) // Also resolves!
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

Apply a function to the value of the `Optional` and return a new `Optional` with the value returned by the transformation.

```js

```


