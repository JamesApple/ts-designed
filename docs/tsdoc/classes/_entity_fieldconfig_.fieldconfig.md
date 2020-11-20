**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Entity/FieldConfig"](tsdoc/modules/_entity_fieldconfig_.md) / FieldConfig

# Class: FieldConfig

## Hierarchy

* **FieldConfig**

## Index

### Constructors

* [constructor](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#constructor)

### Properties

* [entity](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#entity)
* [iterable](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#iterable)
* [name](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#name)

### Methods

* [deserialize](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#deserialize)
* [initialize](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#initialize)

## Constructors

### constructor

\+ **new FieldConfig**(`__namedParameters`: { decorators: PropertyDecorator[] = []; entity: undefined \| [Base](tsdoc/classes/_entity_base_.base.md) ; iterable: boolean = false; name: string ; reflectedEntity: any  }): [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)

*Defined in [src/Entity/FieldConfig.ts:18](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/FieldConfig.ts#L18)*

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { decorators: PropertyDecorator[] = []; entity: undefined \| [Base](tsdoc/classes/_entity_base_.base.md) ; iterable: boolean = false; name: string ; reflectedEntity: any  } |

**Returns:** [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)

## Properties

### entity

• `Optional` **entity**: *typeof* Base

*Defined in [src/Entity/FieldConfig.ts:15](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/FieldConfig.ts#L15)*

___

### iterable

•  **iterable**: boolean

*Defined in [src/Entity/FieldConfig.ts:14](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/FieldConfig.ts#L14)*

___

### name

•  **name**: string

*Defined in [src/Entity/FieldConfig.ts:13](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/FieldConfig.ts#L13)*

## Methods

### deserialize

▸ **deserialize**(`value`: Object): any

*Defined in [src/Entity/FieldConfig.ts:37](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/FieldConfig.ts#L37)*

#### Parameters:

Name | Type |
------ | ------ |
`value` | Object |

**Returns:** any

___

### initialize

▸ **initialize**(`parent`: [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)): void

*Defined in [src/Entity/FieldConfig.ts:33](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/FieldConfig.ts#L33)*

#### Parameters:

Name | Type |
------ | ------ |
`parent` | [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md) |

**Returns:** void
