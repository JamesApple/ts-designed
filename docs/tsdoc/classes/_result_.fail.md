**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Result"](tsdoc/modules/_result_.md) / Fail

# Class: Fail\<E>

## Type parameters

Name |
------ |
`E` |

## Hierarchy

* [Result](tsdoc/classes/_result_.result.md)\<unknown, E>

  ↳ **Fail**

## Index

### Methods

* [getEither](tsdoc/classes/_result_.fail.md#geteither)
* [getOrThrowFailure](tsdoc/classes/_result_.fail.md#getorthrowfailure)
* [isFailure](tsdoc/classes/_result_.fail.md#isfailure)
* [isSuccess](tsdoc/classes/_result_.fail.md#issuccess)
* [map](tsdoc/classes/_result_.fail.md#map)
* [mapFailure](tsdoc/classes/_result_.fail.md#mapfailure)
* [swap](tsdoc/classes/_result_.fail.md#swap)
* [toOptional](tsdoc/classes/_result_.fail.md#tooptional)
* [toOptionalFailure](tsdoc/classes/_result_.fail.md#tooptionalfailure)
* [fail](tsdoc/classes/_result_.fail.md#fail)
* [fromPromise](tsdoc/classes/_result_.fail.md#frompromise)
* [fromThrowable](tsdoc/classes/_result_.fail.md#fromthrowable)
* [of](tsdoc/classes/_result_.fail.md#of)
* [success](tsdoc/classes/_result_.fail.md#success)

## Methods

### getEither

▸ **getEither**(): E

*Overrides [Result](tsdoc/classes/_result_.result.md).[getEither](tsdoc/classes/_result_.result.md#geteither)*

*Defined in [src/Result.ts:90](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L90)*

**Returns:** E

___

### getOrThrowFailure

▸ **getOrThrowFailure**(): unknown

*Overrides [Result](tsdoc/classes/_result_.result.md).[getOrThrowFailure](tsdoc/classes/_result_.result.md#getorthrowfailure)*

*Defined in [src/Result.ts:82](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L82)*

**Returns:** unknown

___

### isFailure

▸ **isFailure**(): this is Fail\<E>

*Overrides [Result](tsdoc/classes/_result_.result.md).[isFailure](tsdoc/classes/_result_.result.md#isfailure)*

*Defined in [src/Result.ts:78](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L78)*

**Returns:** this is Fail\<E>

___

### isSuccess

▸ **isSuccess**(): this is Success\<unknown>

*Overrides [Result](tsdoc/classes/_result_.result.md).[isSuccess](tsdoc/classes/_result_.result.md#issuccess)*

*Defined in [src/Result.ts:74](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L74)*

**Returns:** this is Success\<unknown>

___

### map

▸ **map**\<X, Y>(`_`: (success: unknown) => X, `mapError?`: undefined \| (error: E) => Y): [Result](tsdoc/classes/_result_.result.md)\<X, Y>

*Overrides [Result](tsdoc/classes/_result_.result.md).[map](tsdoc/classes/_result_.result.md#map)*

*Defined in [src/Result.ts:61](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L61)*

#### Type parameters:

Name | Default |
------ | ------ |
`X` | - |
`Y` | E |

#### Parameters:

Name | Type |
------ | ------ |
`_` | (success: unknown) => X |
`mapError?` | undefined \| (error: E) => Y |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<X, Y>

___

### mapFailure

▸ **mapFailure**\<X>(`mapFailure`: (failed: E) => X): [Result](tsdoc/classes/_result_.result.md)\<unknown, X>

*Overrides [Result](tsdoc/classes/_result_.result.md).[mapFailure](tsdoc/classes/_result_.result.md#mapfailure)*

*Defined in [src/Result.ts:70](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L70)*

#### Type parameters:

Name |
------ |
`X` |

#### Parameters:

Name | Type |
------ | ------ |
`mapFailure` | (failed: E) => X |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<unknown, X>

___

### swap

▸ **swap**(): [Result](tsdoc/classes/_result_.result.md)\<E, unknown>

*Overrides [Result](tsdoc/classes/_result_.result.md).[swap](tsdoc/classes/_result_.result.md#swap)*

*Defined in [src/Result.ts:94](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L94)*

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<E, unknown>

___

### toOptional

▸ **toOptional**(): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<unknown>

*Overrides [Result](tsdoc/classes/_result_.result.md).[toOptional](tsdoc/classes/_result_.result.md#tooptional)*

*Defined in [src/Result.ts:102](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L102)*

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<unknown>

___

### toOptionalFailure

▸ **toOptionalFailure**(): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<E>

*Overrides [Result](tsdoc/classes/_result_.result.md).[toOptionalFailure](tsdoc/classes/_result_.result.md#tooptionalfailure)*

*Defined in [src/Result.ts:98](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L98)*

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<E>

___

### fail

▸ `Static`**fail**\<F, T>(`value`: F): [Result](tsdoc/classes/_result_.result.md)\<T, F>

*Inherited from [Result](tsdoc/classes/_result_.result.md).[fail](tsdoc/classes/_result_.result.md#fail)*

*Defined in [src/Result.ts:26](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L26)*

#### Type parameters:

Name | Default |
------ | ------ |
`F` | - |
`T` | unknown |

#### Parameters:

Name | Type |
------ | ------ |
`value` | F |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<T, F>

___

### fromPromise

▸ `Static`**fromPromise**\<T, F>(`promise`: Promise\<T>): Promise\<[Result](tsdoc/classes/_result_.result.md)\<T, F>>

*Inherited from [Result](tsdoc/classes/_result_.result.md).[fromPromise](tsdoc/classes/_result_.result.md#frompromise)*

*Defined in [src/Result.ts:12](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L12)*

#### Type parameters:

Name | Default |
------ | ------ |
`T` | - |
`F` | unknown |

#### Parameters:

Name | Type |
------ | ------ |
`promise` | Promise\<T> |

**Returns:** Promise\<[Result](tsdoc/classes/_result_.result.md)\<T, F>>

___

### fromThrowable

▸ `Static`**fromThrowable**\<T, F>(`throwable`: () => T): [Result](tsdoc/classes/_result_.result.md)\<T, F>

*Inherited from [Result](tsdoc/classes/_result_.result.md).[fromThrowable](tsdoc/classes/_result_.result.md#fromthrowable)*

*Defined in [src/Result.ts:4](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L4)*

#### Type parameters:

Name | Default |
------ | ------ |
`T` | - |
`F` | unknown |

#### Parameters:

Name | Type |
------ | ------ |
`throwable` | () => T |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<T, F>

___

### of

▸ `Static`**of**\<E>(`value`: E): [Fail](tsdoc/classes/_result_.fail.md)\<E>

*Defined in [src/Result.ts:53](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L53)*

#### Type parameters:

Name |
------ |
`E` |

#### Parameters:

Name | Type |
------ | ------ |
`value` | E |

**Returns:** [Fail](tsdoc/classes/_result_.fail.md)\<E>

___

### success

▸ `Static`**success**\<T, F>(`value`: T): [Result](tsdoc/classes/_result_.result.md)\<T, F>

*Inherited from [Result](tsdoc/classes/_result_.result.md).[success](tsdoc/classes/_result_.result.md#success)*

*Defined in [src/Result.ts:22](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L22)*

#### Type parameters:

Name | Default |
------ | ------ |
`T` | - |
`F` | unknown |

#### Parameters:

Name | Type |
------ | ------ |
`value` | T |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<T, F>
