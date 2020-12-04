**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Entity/Base"](tsdoc/modules/_entity_base_.md) / Base

# Class: Base

## Hierarchy

* **Base**

## Index

### Methods

* [asJSON](tsdoc/classes/_entity_base_.base.md#asjson)
* [fields](tsdoc/classes/_entity_base_.base.md#fields)
* [maybe](tsdoc/classes/_entity_base_.base.md#maybe)
* [serialize](tsdoc/classes/_entity_base_.base.md#serialize)
* [toJSON](tsdoc/classes/_entity_base_.base.md#tojson)
* [validate](tsdoc/classes/_entity_base_.base.md#validate)
* [build](tsdoc/classes/_entity_base_.base.md#build)
* [create](tsdoc/classes/_entity_base_.base.md#create)
* [fields](tsdoc/classes/_entity_base_.base.md#fields)
* [fromJSON](tsdoc/classes/_entity_base_.base.md#fromjson)
* [setValidator](tsdoc/classes/_entity_base_.base.md#setvalidator)
* [validator](tsdoc/classes/_entity_base_.base.md#validator)

## Methods

### asJSON

▸ **asJSON**(): Record\<string, unknown>

*Defined in [src/Entity/Base.ts:67](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L67)*

**Returns:** Record\<string, unknown>

___

### fields

▸ **fields**\<T>(`this`: T): [EntityFieldReader](tsdoc/classes/_entity_fieldreader_.entityfieldreader.md)

*Defined in [src/Entity/Base.ts:44](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L44)*

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

### maybe

▸ **maybe**\<T, K>(`this`: T, `value`: K): [Optional](tsdoc/classes/_optional_optional_.optional.md)\<Exclude\<T[K], null \| undefined>>

*Defined in [src/Entity/Base.ts:71](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L71)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | - |
`K` | keyof [WithoutFunctions](tsdoc/modules/_entity_utilitytypes_.md#withoutfunctions)\<T> |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`value` | K |

**Returns:** [Optional](tsdoc/classes/_optional_optional_.optional.md)\<Exclude\<T[K], null \| undefined>>

___

### serialize

▸ **serialize**\<T>(`this`: T): [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)\<T>

*Defined in [src/Entity/Base.ts:48](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L48)*

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

### toJSON

▸ **toJSON**(): Record\<string, unknown>

*Defined in [src/Entity/Base.ts:63](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L63)*

**Returns:** Record\<string, unknown>

___

### validate

▸ **validate**\<T>(`this`: T): T

*Defined in [src/Entity/Base.ts:52](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L52)*

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

▸ `Static`**build**\<T>(`this`: T, `args?`: [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>>): InstanceType\<T>

*Defined in [src/Entity/Base.ts:23](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L23)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`args?` | [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>> |

**Returns:** InstanceType\<T>

___

### create

▸ `Static`**create**\<T>(`this`: T, `args?`: [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>>): InstanceType\<T>

*Defined in [src/Entity/Base.ts:11](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L11)*

Map then validate an entity

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`args?` | [CreateArgs](tsdoc/modules/_entity_utilitytypes_.md#createargs)\<InstanceType\<T>> |

**Returns:** InstanceType\<T>

___

### fields

▸ `Static`**fields**\<T>(`this`: T): [ClassFieldReader](tsdoc/classes/_entity_fieldreader_.classfieldreader.md)

*Defined in [src/Entity/Base.ts:40](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L40)*

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

### fromJSON

▸ `Static`**fromJSON**\<T>(`this`: T, `data`: Record\<string, unknown>): InstanceType\<T>

*Defined in [src/Entity/Base.ts:56](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L56)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | *typeof* [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`this` | T |
`data` | Record\<string, unknown> |

**Returns:** InstanceType\<T>

___

### setValidator

▸ `Static`**setValidator**\<T>(`this`: T, `validator`: *typeof* [validator](tsdoc/classes/_entity_base_.base.md#validator)): void

*Defined in [src/Entity/Base.ts:33](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L33)*

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

*Defined in [src/Entity/Base.ts:32](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Entity/Base.ts#L32)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [Base](tsdoc/classes/_entity_base_.base.md) |

#### Parameters:

Name | Type |
------ | ------ |
`entity` | T |

**Returns:** T
