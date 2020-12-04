**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Result"](tsdoc/modules/_result_.md) / Success

# Class: Success\<T>

## Type parameters

Name |
------ |
`T` |

## Hierarchy

* [Result](tsdoc/classes/_result_.result.md)\<T, unknown>

  ↳ **Success**

## Index

### Methods

* [getEither](tsdoc/classes/_result_.success.md#geteither)
* [getOrThrowFailure](tsdoc/classes/_result_.success.md#getorthrowfailure)
* [isFailure](tsdoc/classes/_result_.success.md#isfailure)
* [isSuccess](tsdoc/classes/_result_.success.md#issuccess)
* [map](tsdoc/classes/_result_.success.md#map)
* [mapFailure](tsdoc/classes/_result_.success.md#mapfailure)
* [swap](tsdoc/classes/_result_.success.md#swap)
* [toOptional](tsdoc/classes/_result_.success.md#tooptional)
* [toOptionalFailure](tsdoc/classes/_result_.success.md#tooptionalfailure)
* [fail](tsdoc/classes/_result_.success.md#fail)
* [fromPromise](tsdoc/classes/_result_.success.md#frompromise)
* [fromThrowable](tsdoc/classes/_result_.success.md#fromthrowable)
* [of](tsdoc/classes/_result_.success.md#of)
* [success](tsdoc/classes/_result_.success.md#success)

## Methods

### getEither

▸ **getEither**(): T

*Overrides [Result](tsdoc/classes/_result_.result.md).[getEither](tsdoc/classes/_result_.result.md#geteither)*

*Defined in [src/Result.ts:136](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L136)*

**Returns:** T

___

### getOrThrowFailure

▸ **getOrThrowFailure**(): T

*Overrides [Result](tsdoc/classes/_result_.result.md).[getOrThrowFailure](tsdoc/classes/_result_.result.md#getorthrowfailure)*

*Defined in [src/Result.ts:132](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L132)*

**Returns:** T

___

### isFailure

▸ **isFailure**(): this is Fail\<unknown>

*Overrides [Result](tsdoc/classes/_result_.result.md).[isFailure](tsdoc/classes/_result_.result.md#isfailure)*

*Defined in [src/Result.ts:128](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L128)*

**Returns:** this is Fail\<unknown>

___

### isSuccess

▸ **isSuccess**(): this is Success\<T>

*Overrides [Result](tsdoc/classes/_result_.result.md).[isSuccess](tsdoc/classes/_result_.result.md#issuccess)*

*Defined in [src/Result.ts:124](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L124)*

**Returns:** this is Success\<T>

___

### map

▸ **map**\<X, Y>(`mapSuccess`: (success: T) => X): [Result](tsdoc/classes/_result_.result.md)\<X, Y>

*Overrides [Result](tsdoc/classes/_result_.result.md).[map](tsdoc/classes/_result_.result.md#map)*

*Defined in [src/Result.ts:116](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L116)*

#### Type parameters:

Name | Default |
------ | ------ |
`X` | - |
`Y` | unknown |

#### Parameters:

Name | Type |
------ | ------ |
`mapSuccess` | (success: T) => X |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<X, Y>

___

### mapFailure

▸ **mapFailure**\<X>(): [Result](tsdoc/classes/_result_.result.md)\<T, X>

*Overrides [Result](tsdoc/classes/_result_.result.md).[mapFailure](tsdoc/classes/_result_.result.md#mapfailure)*

*Defined in [src/Result.ts:120](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L120)*

#### Type parameters:

Name |
------ |
`X` |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<T, X>

___

### swap

▸ **swap**(): [Result](tsdoc/classes/_result_.result.md)\<unknown, T>

*Overrides [Result](tsdoc/classes/_result_.result.md).[swap](tsdoc/classes/_result_.result.md#swap)*

*Defined in [src/Result.ts:140](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L140)*

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<unknown, T>

___

### toOptional

▸ **toOptional**(): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

*Overrides [Result](tsdoc/classes/_result_.result.md).[toOptional](tsdoc/classes/_result_.result.md#tooptional)*

*Defined in [src/Result.ts:148](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L148)*

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

___

### toOptionalFailure

▸ **toOptionalFailure**(): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<unknown>

*Overrides [Result](tsdoc/classes/_result_.result.md).[toOptionalFailure](tsdoc/classes/_result_.result.md#tooptionalfailure)*

*Defined in [src/Result.ts:144](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L144)*

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<unknown>

___

### fail

▸ `Static`**fail**\<F, T>(`value`: F): [Result](tsdoc/classes/_result_.result.md)\<T, F>

*Inherited from [Result](tsdoc/classes/_result_.result.md).[fail](tsdoc/classes/_result_.result.md#fail)*

*Defined in [src/Result.ts:26](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L26)*

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

*Defined in [src/Result.ts:12](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L12)*

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

*Defined in [src/Result.ts:4](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L4)*

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

▸ `Static`**of**\<E>(`value`: E): [Success](tsdoc/classes/_result_.success.md)\<E>

*Defined in [src/Result.ts:112](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L112)*

#### Type parameters:

Name |
------ |
`E` |

#### Parameters:

Name | Type |
------ | ------ |
`value` | E |

**Returns:** [Success](tsdoc/classes/_result_.success.md)\<E>

___

### success

▸ `Static`**success**\<T, F>(`value`: T): [Result](tsdoc/classes/_result_.result.md)\<T, F>

*Inherited from [Result](tsdoc/classes/_result_.result.md).[success](tsdoc/classes/_result_.result.md#success)*

*Defined in [src/Result.ts:22](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Result.ts#L22)*

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
