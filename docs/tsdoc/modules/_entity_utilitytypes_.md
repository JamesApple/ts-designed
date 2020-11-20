**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / "Entity/utilityTypes"

# Module: "Entity/utilityTypes"

## Index

### Classes

* [EntityInitializationError](tsdoc/classes/_entity_utilitytypes_.entityinitializationerror.md)

### Type aliases

* [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)
* [SimpleCreateArgs](tsdoc/modules/_entity_utilitytypes_.md#simplecreateargs)
* [WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)

## Type aliases

### CreateArgs

Ƭ  **CreateArgs**\<I, D>: [SimpleCreateArgs](tsdoc/modules/_entity_utilitytypes_.md#simplecreateargs)\<I>

*Defined in [src/Entity/utilityTypes.ts:12](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/utilityTypes.ts#L12)*

#### Type parameters:

Name | Type |
------ | ------ |
`I` | [Base](tsdoc/classes/_entity_base_.base.md) |
`D` | - |

___

### SimpleCreateArgs

Ƭ  **SimpleCreateArgs**\<I>: Partial\<I>

*Defined in [src/Entity/utilityTypes.ts:14](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/utilityTypes.ts#L14)*

#### Type parameters:

Name | Type |
------ | ------ |
`I` | [Base](tsdoc/classes/_entity_base_.base.md) |

___

### WithoutFunctions

Ƭ  **WithoutFunctions**\<T>: Pick\<T, {}[keyof T]>

*Defined in [src/Entity/utilityTypes.ts:5](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/utilityTypes.ts#L5)*

#### Type parameters:

Name |
------ |
`T` |
