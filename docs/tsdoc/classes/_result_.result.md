**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Result"](tsdoc/modules/_result_.md) / Result

# Class: Result\<T, F>

## Type parameters

Name |
------ |
`T` |
`F` |

## Hierarchy

* **Result**

  ↳ [Fail](tsdoc/classes/_result_.fail.md)

  ↳ [Success](tsdoc/classes/_result_.success.md)

## Index

### Methods

* [getEither](tsdoc/classes/_result_.result.md#geteither)
* [getOrThrowFailure](tsdoc/classes/_result_.result.md#getorthrowfailure)
* [isFailure](tsdoc/classes/_result_.result.md#isfailure)
* [isSuccess](tsdoc/classes/_result_.result.md#issuccess)
* [map](tsdoc/classes/_result_.result.md#map)
* [mapFailure](tsdoc/classes/_result_.result.md#mapfailure)
* [swap](tsdoc/classes/_result_.result.md#swap)
* [toOptional](tsdoc/classes/_result_.result.md#tooptional)
* [toOptionalFailure](tsdoc/classes/_result_.result.md#tooptionalfailure)
* [fail](tsdoc/classes/_result_.result.md#fail)
* [fromPromise](tsdoc/classes/_result_.result.md#frompromise)
* [fromThrowable](tsdoc/classes/_result_.result.md#fromthrowable)
* [success](tsdoc/classes/_result_.result.md#success)

## Methods

### getEither

▸ `Abstract`**getEither**(): T \| F

*Defined in [src/Result.ts:43](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L43)*

**Returns:** T \| F

___

### getOrThrowFailure

▸ `Abstract`**getOrThrowFailure**(): T

*Defined in [src/Result.ts:41](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L41)*

**Returns:** T

___

### isFailure

▸ `Abstract`**isFailure**(): this is Fail\<F>

*Defined in [src/Result.ts:39](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L39)*

**Returns:** this is Fail\<F>

___

### isSuccess

▸ `Abstract`**isSuccess**(): this is Success\<T>

*Defined in [src/Result.ts:37](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L37)*

**Returns:** this is Success\<T>

___

### map

▸ `Abstract`**map**\<X, Y>(`mapSuccess`: (success: T) => X, `mapError?`: undefined \| (error: F) => Y): [Result](tsdoc/classes/_result_.result.md)\<X, Y>

*Defined in [src/Result.ts:30](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L30)*

#### Type parameters:

Name | Default |
------ | ------ |
`X` | - |
`Y` | F |

#### Parameters:

Name | Type |
------ | ------ |
`mapSuccess` | (success: T) => X |
`mapError?` | undefined \| (error: F) => Y |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<X, Y>

___

### mapFailure

▸ `Abstract`**mapFailure**\<X>(`mapFailure`: (failed: F) => X): [Result](tsdoc/classes/_result_.result.md)\<T, X>

*Defined in [src/Result.ts:35](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L35)*

#### Type parameters:

Name |
------ |
`X` |

#### Parameters:

Name | Type |
------ | ------ |
`mapFailure` | (failed: F) => X |

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<T, X>

___

### swap

▸ `Abstract`**swap**(): [Result](tsdoc/classes/_result_.result.md)\<F, T>

*Defined in [src/Result.ts:45](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L45)*

**Returns:** [Result](tsdoc/classes/_result_.result.md)\<F, T>

___

### toOptional

▸ `Abstract`**toOptional**(): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

*Defined in [src/Result.ts:49](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L49)*

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<T>

___

### toOptionalFailure

▸ `Abstract`**toOptionalFailure**(): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<F>

*Defined in [src/Result.ts:47](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Result.ts#L47)*

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<F>

___

### fail

▸ `Static`**fail**\<F, T>(`value`: F): [Result](tsdoc/classes/_result_.result.md)\<T, F>

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

### success

▸ `Static`**success**\<T, F>(`value`: T): [Result](tsdoc/classes/_result_.result.md)\<T, F>

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
