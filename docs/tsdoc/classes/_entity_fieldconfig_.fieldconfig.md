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
* [name](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#name)
* [reflectedEntity](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#reflectedentity)

### Methods

* [clone](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#clone)
* [deserialize](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#deserialize)
* [initialize](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md#initialize)

## Constructors

### constructor

\+ **new FieldConfig**(`__namedParameters`: { deserialize: undefined \| (v: any) => any ; entity: undefined \| Object ; name: string ; reflectedEntity: any  }): [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)

*Defined in [src/Entity/FieldConfig.ts:16](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/FieldConfig.ts#L16)*

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { deserialize: undefined \| (v: any) => any ; entity: undefined \| Object ; name: string ; reflectedEntity: any  } |

**Returns:** [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)

## Properties

### entity

• `Optional` **entity**: Object

*Defined in [src/Entity/FieldConfig.ts:14](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/FieldConfig.ts#L14)*

___

### name

•  **name**: string

*Defined in [src/Entity/FieldConfig.ts:11](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/FieldConfig.ts#L11)*

___

### reflectedEntity

•  **reflectedEntity**: any

*Defined in [src/Entity/FieldConfig.ts:13](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/FieldConfig.ts#L13)*

## Methods

### clone

▸ **clone**(): [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)

*Defined in [src/Entity/FieldConfig.ts:46](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/FieldConfig.ts#L46)*

**Returns:** [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)

___

### deserialize

▸ **deserialize**(`value`: Object): any

*Defined in [src/Entity/FieldConfig.ts:28](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/FieldConfig.ts#L28)*

#### Parameters:

Name | Type |
------ | ------ |
`value` | Object |

**Returns:** any

___

### initialize

▸ **initialize**(`_parent`: [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)): void

*Defined in [src/Entity/FieldConfig.ts:26](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/FieldConfig.ts#L26)*

#### Parameters:

Name | Type |
------ | ------ |
`_parent` | [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md) |

**Returns:** void
