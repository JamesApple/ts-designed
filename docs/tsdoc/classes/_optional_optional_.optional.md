**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Optional/Optional"](tsdoc/modules/_optional_optional_.md) / Optional

# Class: Optional\<T>

## Type parameters

Name |
------ |
`T` |

## Hierarchy

* **Optional**

## Index

### Methods

* [asJSON](tsdoc/classes/_optional_optional_.optional.md#asjson)
* [filter](tsdoc/classes/_optional_optional_.optional.md#filter)
* [flatMap](tsdoc/classes/_optional_optional_.optional.md#flatmap)
* [get](tsdoc/classes/_optional_optional_.optional.md#get)
* [isAbsent](tsdoc/classes/_optional_optional_.optional.md#isabsent)
* [isPresent](tsdoc/classes/_optional_optional_.optional.md#ispresent)
* [map](tsdoc/classes/_optional_optional_.optional.md#map)
* [orElse](tsdoc/classes/_optional_optional_.optional.md#orelse)
* [orGet](tsdoc/classes/_optional_optional_.optional.md#orget)
* [orThrow](tsdoc/classes/_optional_optional_.optional.md#orthrow)
* [toJSON](tsdoc/classes/_optional_optional_.optional.md#tojson)
* [empty](tsdoc/classes/_optional_optional_.optional.md#empty)
* [fromJSON](tsdoc/classes/_optional_optional_.optional.md#fromjson)
* [of](tsdoc/classes/_optional_optional_.optional.md#of)

## Methods

### asJSON

▸ `Abstract`**asJSON**(): T \| null

*Defined in [src/Optional/Optional.ts:159](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L159)*

Serialize a value using designed's preferred #asJSON method

**Returns:** T \| null

___

### filter

▸ `Abstract`**filter**(`predicate`: (value: T) => boolean): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

*Defined in [src/Optional/Optional.ts:78](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L78)*

**`example`** 
Will remove a value that does not satisfy the predicate.

```ts
Optional.of(5).filter(n => n > 5) // AbsentOptional<number>
Optional.of(5).filter(n => n === 5) // PresentOptional<number>
```

#### Parameters:

Name | Type |
------ | ------ |
`predicate` | (value: T) => boolean |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

___

### flatMap

▸ `Abstract`**flatMap**\<X>(`transform`: (value: T) => [Optional](tsdoc/classes/_optional_optional_.optional.md)\<X>): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<X>

*Defined in [src/Optional/Optional.ts:107](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L107)*

**`remark`** 
Apply a transform to the value of the optional and return a new optional
of its value. This means you can take a function that returns another
function and it will "collapse" the optional

**`example`** 

```ts
Optional.of('Hello').map(s => s.toUpperCase()) // Optional<"HELLO">
Optional.of(null).map(s => s.toUpperCase())    // AbsentOptional<string>
```

#### Type parameters:

Name |
------ |
`X` |

#### Parameters:

Name | Type |
------ | ------ |
`transform` | (value: T) => [Optional](tsdoc/classes/_optional_optional_.optional.md)\<X> |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<X>

___

### get

▸ `Abstract`**get**(): T

*Defined in [src/Optional/Optional.ts:148](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L148)*

**`example`** 
```ts
Optional.of(5).get() // 5
Optional.of(5).get() // throw TypeError
```

**Returns:** T

___

### isAbsent

▸ `Abstract`**isAbsent**(): this is AbsentOptional\<T>

*Defined in [src/Optional/Optional.ts:67](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L67)*

**`example`** 

Used in an if statement, will guarantee the type of the optional as either present or absent
```ts
if (maybeUser.isAbsent()) {
 maybeUser; // Instance of AbsentOptional<User>
}
```

**Returns:** this is AbsentOptional\<T>

___

### isPresent

▸ `Abstract`**isPresent**(): this is PresentOptional\<T>

*Defined in [src/Optional/Optional.ts:55](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L55)*

**`example`** 

Used in an if statement, will guarantee the type of the optional as either present or absent
```ts
if (maybeUser.isPresent()) {
 maybeUser; // Instance of PresentOptional<User>
}
```

**Returns:** this is PresentOptional\<T>

___

### map

▸ `Abstract`**map**\<X>(`transform`: (value: T) => X): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<X>>

*Defined in [src/Optional/Optional.ts:92](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L92)*

**`remark`** 
Apply a transform to the value of the optional and return a new optional
of the result. This will not allow the return value to be nullable.

**`example`** 

```ts
Optional.of('Hello').map(s => s.toUpperCase()) // Optional<"HELLO">
Optional.of(null).map(s => s.toUpperCase())    // AbsentOptional<string>
```

#### Type parameters:

Name |
------ |
`X` |

#### Parameters:

Name | Type |
------ | ------ |
`transform` | (value: T) => X |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<X>>

___

### orElse

▸ `Abstract`**orElse**\<X>(`other`: X): T \| X

*Defined in [src/Optional/Optional.ts:117](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L117)*

**`example`** 

```ts
Optional.of(5).orElse('not there') // 5 (typeof string | number)
Optional.empty().orElse('not there') // 'not there' (typeof string | number)
```

#### Type parameters:

Name |
------ |
`X` |

#### Parameters:

Name | Type |
------ | ------ |
`other` | X |

**Returns:** T \| X

___

### orGet

▸ `Abstract`**orGet**\<X>(`supplier`: () => X): T \| X

*Defined in [src/Optional/Optional.ts:127](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L127)*

**`example`** 
Use a getter function to return a new value

```ts
Optional.of(5).orGet(() => 'not there') // 5 (typeof string | number)
```

#### Type parameters:

Name |
------ |
`X` |

#### Parameters:

Name | Type |
------ | ------ |
`supplier` | () => X |

**Returns:** T \| X

___

### orThrow

▸ `Abstract`**orThrow**(`errThrower`: () => [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error)): T

*Defined in [src/Optional/Optional.ts:139](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L139)*

**`remark`** 
This _must_ throw an exception when the method is invoked or the optional
itself will throw a `TypeError`.

**`example`** 
```ts
Optional.of(5).orThrow(() => { throw new Error('I am thrown'); })
Optional.of(5).orThrow(() => new Error('I am thrown'))
```

#### Parameters:

Name | Type |
------ | ------ |
`errThrower` | () => [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error) |

**Returns:** T

___

### toJSON

▸ `Abstract`**toJSON**(`_`: string): T \| null

*Defined in [src/Optional/Optional.ts:154](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L154)*

**`remark`** 
Used with other libraries to allow serialization to JSON without coercing to a string

#### Parameters:

Name | Type |
------ | ------ |
`_` | string |

**Returns:** T \| null

___

### empty

▸ `Static`**empty**\<T>(): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

*Defined in [src/Optional/Optional.ts:41](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L41)*

**`remark`** 
Create an empty optional to model a failure case

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

___

### fromJSON

▸ `Static`**fromJSON**\<T>(`data`: T): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

*Defined in [src/Optional/Optional.ts:35](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L35)*

**`remark`** 
Used for compatibility with other parts of this library that utilize
fromJSON/asJSON/toJSON to manage serialization. This is logically the same as `Optional.of`

**`example`** 
```ts
Optional.fromJSON(null)
Optional.fromJSON('Hello')
```

#### Type parameters:

Name | Default |
------ | ------ |
`T` | any |

#### Parameters:

Name | Type |
------ | ------ |
`data` | T |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

___

### of

▸ `Static`**of**\<T>(`value`: T \| [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<T>>): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<T>>

*Defined in [src/Optional/Optional.ts:14](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Optional/Optional.ts#L14)*

**`example`** 
Create an optional from a nullable value. This will remove the types null
or undefined using `value != null`.

```ts
Optional.of('Hello') // Optional<string>
Optional.of<string>(null) // Optional<string>
```

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`value` | T \| [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<T>> |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<T>>
