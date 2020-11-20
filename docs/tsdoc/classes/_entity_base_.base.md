**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Entity/Base"](tsdoc/modules/_entity_base_.md) / Base

# Class: Base

## Hierarchy

* **Base**

## Index

### Methods

* [fields](tsdoc/classes/_entity_base_.base.md#fields)
* [serialize](tsdoc/classes/_entity_base_.base.md#serialize)
* [validate](tsdoc/classes/_entity_base_.base.md#validate)
* [build](tsdoc/classes/_entity_base_.base.md#build)
* [create](tsdoc/classes/_entity_base_.base.md#create)
* [fields](tsdoc/classes/_entity_base_.base.md#fields)
* [setValidator](tsdoc/classes/_entity_base_.base.md#setvalidator)
* [validator](tsdoc/classes/_entity_base_.base.md#validator)

## Methods

### fields

▸ **fields**\<T>(`this`: T): [EntityFieldReader](tsdoc/classes/_entity_fieldreader_.entityfieldreader.md)

*Defined in [src/Entity/Base.ts:43](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L43)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |

**Returns:** [EntityFieldReader](tsdoc/classes/_entity_fieldreader_.entityfieldreader.md)

___

### serialize

▸ **serialize**\<T>(`this`: T): [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)\<T>

*Defined in [src/Entity/Base.ts:47](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L47)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |

**Returns:** [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)\<T>

___

### validate

▸ **validate**\<T>(`this`: T): T

*Defined in [src/Entity/Base.ts:51](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L51)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |

**Returns:** T

___

### build

▸ `Static`**build**\<T, D>(`this`: T, `args?`: [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>, D>): InstanceType\<T>

*Defined in [src/Entity/Base.ts:22](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L22)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [Base](tsdoc/classes/_entity_base_.base.md) |
`D` | Object |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`args?` | [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>, D> |

**Returns:** InstanceType\<T>

___

### create

▸ `Static`**create**\<T, D>(`this`: T, `args?`: [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>, D>): InstanceType\<T>

*Defined in [src/Entity/Base.ts:10](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L10)*

Map then validate an entity

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [Base](tsdoc/classes/_entity_base_.base.md) |
`D` | Object |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`args?` | [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>, D> |

**Returns:** InstanceType\<T>

___

### fields

▸ `Static`**fields**\<T>(`this`: T): [ClassFieldReader](tsdoc/classes/_entity_fieldreader_.classfieldreader.md)

*Defined in [src/Entity/Base.ts:39](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L39)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |

**Returns:** [ClassFieldReader](tsdoc/classes/_entity_fieldreader_.classfieldreader.md)

___

### setValidator

▸ `Static`**setValidator**\<T>(`this`: T, `validator`: *typeof* [validator](tsdoc/classes/_entity_base_.base.md#validator)): void

*Defined in [src/Entity/Base.ts:32](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L32)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`validator` | *typeof* [validator](tsdoc/classes/_entity_base_.base.md#validator) |

**Returns:** void

___

### validator

▸ `Static`**validator**\<T>(`entity`: T): T

*Defined in [src/Entity/Base.ts:31](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/Base.ts#L31)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`entity` | T |

**Returns:** T
