**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Entity/EntitySerializer"](tsdoc/modules/_entity_entityserializer_.md) / EntitySerializer

# Class: EntitySerializer\<T>

## Type parameters

Name | Type |
------ | ------ |
`T` | [Base](tsdoc/classes/_entity_base_.base.md) |

## Hierarchy

* **EntitySerializer**

## Index

### Constructors

* [constructor](tsdoc/classes/_entity_entityserializer_.entityserializer.md#constructor)

### Methods

* [asJSON](tsdoc/classes/_entity_entityserializer_.entityserializer.md#asjson)
* [mapOut](tsdoc/classes/_entity_entityserializer_.entityserializer.md#mapout)
* [mapOutRaw](tsdoc/classes/_entity_entityserializer_.entityserializer.md#mapoutraw)

## Constructors

### constructor

\+ **new EntitySerializer**(`instance`: T): [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)

*Defined in [src/Entity/EntitySerializer.ts:7](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/EntitySerializer.ts#L7)*

#### Parameters:

Name | Type |
------ | ------ |
`instance` | T |

**Returns:** [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)

## Methods

### asJSON

▸ **asJSON**(): AsJsonResult\<T>

*Defined in [src/Entity/EntitySerializer.ts:40](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/EntitySerializer.ts#L40)*

**Returns:** AsJsonResult\<T>

___

### mapOut

▸ **mapOut**\<O>(`target`: O, ...`fields`: [MapOutArgs](tsdoc/modules/_entity_entityserializer_.md#mapoutargs)\<[WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<T>, [WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<O>>): O

*Defined in [src/Entity/EntitySerializer.ts:10](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/EntitySerializer.ts#L10)*

#### Type parameters:

Name | Type |
------ | ------ |
`O` | Object |

#### Parameters:

Name | Type |
------ | ------ |
`target` | O |
`...fields` | [MapOutArgs](tsdoc/modules/_entity_entityserializer_.md#mapoutargs)\<[WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<T>, [WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<O>> |

**Returns:** O

___

### mapOutRaw

▸ **mapOutRaw**\<O>(...`fields`: [MapOutArgs](tsdoc/modules/_entity_entityserializer_.md#mapoutargs)\<[WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<T>, [WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<O>>): O

*Defined in [src/Entity/EntitySerializer.ts:17](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/EntitySerializer.ts#L17)*

#### Type parameters:

Name | Type |
------ | ------ |
`O` | Object |

#### Parameters:

Name | Type |
------ | ------ |
`...fields` | [MapOutArgs](tsdoc/modules/_entity_entityserializer_.md#mapoutargs)\<[WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<T>, [WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<O>> |

**Returns:** O
