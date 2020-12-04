**[designed](tsdoc/README.md)**

> [Globals](tsdoc/globals.md) / ["Topic/Topic"](tsdoc/modules/_topic_topic_.md) / Topic

# Class: Topic\<T, T>

## Type parameters

Name |
------ |
`T` |
`T` |

## Hierarchy

* **Topic**

## Implements

* [Topic](tsdoc/classes/_topic_topic_.topic.md)\<T>

## Implemented by

* [Topic](tsdoc/classes/_topic_topic_.topic.md)

## Index

### Methods

* [publish](tsdoc/classes/_topic_topic_.topic.md#publish)
* [subscribe](tsdoc/classes/_topic_topic_.topic.md#subscribe)
* [create](tsdoc/classes/_topic_topic_.topic.md#create)

## Methods

### publish

▸ **publish**(`event`: T): void

*Defined in [src/Topic/Topic.ts:6](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Topic/Topic.ts#L6)*

#### Parameters:

Name | Type |
------ | ------ |
`event` | T |

**Returns:** void

___

### subscribe

▸ **subscribe**(`consumer`: ConsumerFunction\<T>): TeardownFunction

*Defined in [src/Topic/Topic.ts:5](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Topic/Topic.ts#L5)*

#### Parameters:

Name | Type |
------ | ------ |
`consumer` | ConsumerFunction\<T> |

**Returns:** TeardownFunction

___

### create

▸ `Static`**create**\<T>(`config?`: [TopicConfig](tsdoc/interfaces/_topic_topic_.topicconfig.md)\<T>): [Topic](tsdoc/classes/_topic_topic_.topic.md)\<T>

*Defined in [src/Topic/Topic.ts:22](https://github.com/jamesapple/ts-designed/blob/be057cd/src/Topic/Topic.ts#L22)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`config?` | [TopicConfig](tsdoc/interfaces/_topic_topic_.topicconfig.md)\<T> |

**Returns:** [Topic](tsdoc/classes/_topic_topic_.topic.md)\<T>
