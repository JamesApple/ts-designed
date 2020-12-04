**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["DomainError/DomainError"](tsdoc/modules/_domainerror_domainerror_.md) / DomainError

# Class: DomainError

## Hierarchy

* [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error)

  ↳ **DomainError**

## Index

### Properties

* [details](tsdoc/classes/_domainerror_domainerror_.domainerror.md#details)
* [message](tsdoc/classes/_domainerror_domainerror_.domainerror.md#message)
* [previousError](tsdoc/classes/_domainerror_domainerror_.domainerror.md#previouserror)
* [stack](tsdoc/classes/_domainerror_domainerror_.domainerror.md#stack)
* [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error)

### Accessors

* [name](tsdoc/classes/_domainerror_domainerror_.domainerror.md#name)

### Methods

* [getCause](tsdoc/classes/_domainerror_domainerror_.domainerror.md#getcause)
* [getPreviousErrors](tsdoc/classes/_domainerror_domainerror_.domainerror.md#getpreviouserrors)
* [getRootCause](tsdoc/classes/_domainerror_domainerror_.domainerror.md#getrootcause)
* [toString](tsdoc/classes/_domainerror_domainerror_.domainerror.md#tostring)
* [create](tsdoc/classes/_domainerror_domainerror_.domainerror.md#create)
* [wrap](tsdoc/classes/_domainerror_domainerror_.domainerror.md#wrap)

## Properties

### details

•  **details**: { [key:string]: any;  }

*Defined in [src/DomainError/DomainError.ts:5](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L5)*

___

### message

•  **message**: string

*Overrides [EntityInitializationError](tsdoc/classes/_entity_utilitytypes_.entityinitializationerror.md).[message](tsdoc/classes/_entity_utilitytypes_.entityinitializationerror.md#message)*

*Defined in [src/DomainError/DomainError.ts:3](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L3)*

___

### previousError

• `Optional` **previousError**: [DomainError](tsdoc/classes/_domainerror_domainerror_.domainerror.md) \| [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error)

*Defined in [src/DomainError/DomainError.ts:2](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L2)*

___

### stack

• `Optional` **stack**: undefined \| string

*Inherited from [DomainError](tsdoc/classes/_domainerror_domainerror_.domainerror.md).[stack](tsdoc/classes/_domainerror_domainerror_.domainerror.md#stack)*

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*

___

### Error

▪ `Static` **Error**: ErrorConstructor

*Defined in node_modules/typescript/lib/lib.es5.d.ts:984*

## Accessors

### name

• get **name**(): string

*Overrides [EntityInitializationError](tsdoc/classes/_entity_utilitytypes_.entityinitializationerror.md).[name](tsdoc/classes/_entity_utilitytypes_.entityinitializationerror.md#name)*

*Defined in [src/DomainError/DomainError.ts:25](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L25)*

**Returns:** string

## Methods

### getCause

▸ **getCause**(): [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error) \| undefined

*Defined in [src/DomainError/DomainError.ts:7](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L7)*

**Returns:** [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error) \| undefined

___

### getPreviousErrors

▸ **getPreviousErrors**(): [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error)[]

*Defined in [src/DomainError/DomainError.ts:16](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L16)*

**Returns:** [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error)[]

___

### getRootCause

▸ **getRootCause**(): [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error) \| undefined

*Defined in [src/DomainError/DomainError.ts:11](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L11)*

**Returns:** [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error) \| undefined

___

### toString

▸ **toString**(): string

*Defined in [src/DomainError/DomainError.ts:35](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L35)*

**Returns:** string

___

### create

▸ `Static`**create**\<T>(`this`: T, `message?`: undefined \| string, `overrides?`: Partial\<InstanceType\<T>>): InstanceType\<T>

*Defined in [src/DomainError/DomainError.ts:55](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L55)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [DomainError](tsdoc/classes/_domainerror_domainerror_.domainerror.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`message?` | undefined \| string |
`overrides?` | Partial\<InstanceType\<T>> |

**Returns:** InstanceType\<T>

___

### wrap

▸ `Static`**wrap**\<T>(`this`: T, `error`: [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error), ...`rest`: Parameters\<T[\"create\"]>): InstanceType\<T>

*Defined in [src/DomainError/DomainError.ts:42](https://github.com/jamesapple/ts-designed/blob/be057cd/src/DomainError/DomainError.ts#L42)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [DomainError](tsdoc/classes/_domainerror_domainerror_.domainerror.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`error` | [Error](tsdoc/classes/_domainerror_domainerror_.domainerror.md#error) |
`...rest` | Parameters\<T[\"create\"]> |

**Returns:** InstanceType\<T>
