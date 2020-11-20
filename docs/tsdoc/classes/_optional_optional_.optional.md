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

*Defined in [src/Optional/Optional.ts:147](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L147)*

Serialize a value using designed's preferred #asJSON method

**Returns:** T \| null

___

### filter

▸ `Abstract`**filter**(`predicate`: (value: T) => boolean): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

*Defined in [src/Optional/Optional.ts:76](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L76)*

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

*Defined in [src/Optional/Optional.ts:105](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L105)*

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

### isAbsent

▸ `Abstract`**isAbsent**(): this is AbsentOptional\<T>

*Defined in [src/Optional/Optional.ts:65](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L65)*

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

*Defined in [src/Optional/Optional.ts:53](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L53)*

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

*Defined in [src/Optional/Optional.ts:90](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L90)*

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

*Defined in [src/Optional/Optional.ts:115](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L115)*

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

*Defined in [src/Optional/Optional.ts:125](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L125)*

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

▸ `Abstract`**orThrow**(`errThrower`: () => any): T

*Defined in [src/Optional/Optional.ts:136](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L136)*

**`remark`** 
This _must_ throw an exception when the method is invoked or the optional
itself will throw a `TypeError`.

**`example`** 
```ts
Optional.of(5).orThrow(() => { throw new Error('I am thrown'); })
```

#### Parameters:

Name | Type |
------ | ------ |
`errThrower` | () => any |

**Returns:** T

___

### toJSON

▸ `Abstract`**toJSON**(`_`: string): T \| null

*Defined in [src/Optional/Optional.ts:142](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L142)*

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

*Defined in [src/Optional/Optional.ts:39](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L39)*

**`remark`** 
Create an empty optional to model a failure case

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

___

### fromJSON

▸ `Static`**fromJSON**(`data`: any): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<any>

*Defined in [src/Optional/Optional.ts:33](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L33)*

**`remark`** 
Used for compatibility with other parts of this library that utilize
fromJSON/asJSON/toJSON to manage serialization. This is logically the same as `Optional.of`

**`example`** 
```ts
Optional.fromJSON(null)
Optional.fromJSON('Hello')
```

#### Parameters:

Name | Type |
------ | ------ |
`data` | any |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<any>

___

### of

▸ `Static`**of**\<T>(`value`: T \| [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<T>>): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<NonNullable\<T>>

*Defined in [src/Optional/Optional.ts:12](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Optional/Optional.ts#L12)*

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
