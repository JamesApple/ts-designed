**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / "Entity/EntitySerializer"

# Module: "Entity/EntitySerializer"

## Index

### Classes

* [EntitySerializer](tsdoc/classes/_entity_entityserializer_.entityserializer.md)

### Type aliases

* [MapOutArg](tsdoc/modules/_entity_entityserializer_.md#mapoutarg)
* [MapOutArgs](tsdoc/modules/_entity_entityserializer_.md#mapoutargs)

## Type aliases

### MapOutArg

Ƭ  **MapOutArg**\<T, O>: SameTypeFields\<T, O> \| MapDirect\<T, O, keyof T & keyof O> \| MapIndirect\<T, O, keyof T, keyof O>

*Defined in [src/Entity/EntitySerializer.ts:87](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntitySerializer.ts#L87)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | FunctionlessBase |
`O` | Object |

___

### MapOutArgs

Ƭ  **MapOutArgs**\<T, O>: [MapOutArg](tsdoc/modules/_entity_entityserializer_.md#mapoutarg)\<T, O>[]

*Defined in [src/Entity/EntitySerializer.ts:82](https://github.com/jamesapple/ts-designed/blob/d9cf2e1/src/Entity/EntitySerializer.ts#L82)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | FunctionlessBase |
`O` | Object |
