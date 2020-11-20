**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Entity/EntityConfig"](tsdoc/modules/_entity_entityconfig_.md) / EntityConfig

# Class: EntityConfig

## Hierarchy

* **EntityConfig**

## Index

### Constructors

* [constructor](tsdoc/classes/_entity_entityconfig_.entityconfig.md#constructor)

### Properties

* [proto](tsdoc/classes/_entity_entityconfig_.entityconfig.md#proto)

### Methods

* [addField](tsdoc/classes/_entity_entityconfig_.entityconfig.md#addfield)
* [eachField](tsdoc/classes/_entity_entityconfig_.entityconfig.md#eachfield)
* [getFields](tsdoc/classes/_entity_entityconfig_.entityconfig.md#getfields)
* [forConstructor](tsdoc/classes/_entity_entityconfig_.entityconfig.md#forconstructor)
* [forInstance](tsdoc/classes/_entity_entityconfig_.entityconfig.md#forinstance)
* [forPrototype](tsdoc/classes/_entity_entityconfig_.entityconfig.md#forprototype)

## Constructors

### constructor

\+ **new EntityConfig**(`proto`: Object): [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)

*Defined in [src/Entity/EntityConfig.ts:4](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L4)*

#### Parameters:

Name | Type |
------ | ------ |
`proto` | Object |

**Returns:** [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)

## Properties

### proto

•  **proto**: Object

*Defined in [src/Entity/EntityConfig.ts:5](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L5)*

## Methods

### addField

▸ **addField**(`field`: [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)): void

*Defined in [src/Entity/EntityConfig.ts:21](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L21)*

#### Parameters:

Name | Type |
------ | ------ |
`field` | [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md) |

**Returns:** void

___

### eachField

▸ **eachField**(`visit`: (f: [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)) => void): void

*Defined in [src/Entity/EntityConfig.ts:15](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L15)*

#### Parameters:

Name | Type |
------ | ------ |
`visit` | (f: [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)) => void |

**Returns:** void

___

### getFields

▸ **getFields**(): [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)[]

*Defined in [src/Entity/EntityConfig.ts:11](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L11)*

**Returns:** [FieldConfig](tsdoc/classes/_entity_fieldconfig_.fieldconfig.md)[]

___

### forConstructor

▸ `Static`**forConstructor**(`constructor`: Function): [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)

*Defined in [src/Entity/EntityConfig.ts:30](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L30)*

#### Parameters:

Name | Type |
------ | ------ |
`constructor` | Function |

**Returns:** [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)

___

### forInstance

▸ `Static`**forInstance**(`entity`: [Base](tsdoc/classes/_entity_base_.base.md)): [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)

*Defined in [src/Entity/EntityConfig.ts:26](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L26)*

#### Parameters:

Name | Type |
------ | ------ |
`entity` | [Base](tsdoc/classes/_entity_base_.base.md) |

**Returns:** [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)

___

### forPrototype

▸ `Static`**forPrototype**(`proto`: Object): [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)

*Defined in [src/Entity/EntityConfig.ts:34](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntityConfig.ts#L34)*

#### Parameters:

Name | Type |
------ | ------ |
`proto` | Object |

**Returns:** [EntityConfig](tsdoc/classes/_entity_entityconfig_.entityconfig.md)
