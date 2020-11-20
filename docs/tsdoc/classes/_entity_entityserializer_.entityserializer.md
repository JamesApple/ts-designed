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
* [mapTo](tsdoc/classes/_entity_entityserializer_.entityserializer.md#mapto)

## Constructors

### constructor

\+ **new EntitySerializer**(`instance`: T): [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)

*Defined in [src/Entity/EntitySerializer.ts:7](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntitySerializer.ts#L7)*

#### Parameters:

Name | Type |
------ | ------ |
`instance` | T |

**Returns:** [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)

## Methods

### asJSON

▸ **asJSON**(): AsJsonResult\<T>

*Defined in [src/Entity/EntitySerializer.ts:52](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntitySerializer.ts#L52)*

**Returns:** AsJsonResult\<T>

___

### mapOut

▸ **mapOut**\<O>(`target`: O, ...`fields`: [MapOutArgs](tsdoc/modules/_entity_entityserializer_.md#mapoutargs)\<[WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<T>, [WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<O>>): O

*Defined in [src/Entity/EntitySerializer.ts:10](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntitySerializer.ts#L10)*

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

### mapTo

▸ **mapTo**\<O>(`mapping`: MappedSerializeArgs\<T, O>, `target?`: Partial\<O>): O

*Defined in [src/Entity/EntitySerializer.ts:34](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntitySerializer.ts#L34)*

#### Type parameters:

Name | Type |
------ | ------ |
`O` | Record\<string, any> |

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`mapping` | MappedSerializeArgs\<T, O> | - |
`target` | Partial\<O> | {} |

**Returns:** O
