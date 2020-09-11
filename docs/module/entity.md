# Entity Module

## Problem

Building domain entities that can be used in multiple contexts is difficult. 

Typically you will need to create an entity such as `User`. For some less strict apps this can be a simple object such as below.

```typescript
interface User {
  id: string,
  email: string,
}
```

This is easy enough to transfer to a database or validate. Apply a regular expression to the email, check the ID is valid and you're done. 

Problems don't arrive until later on in your product lifecycle. What happens when more fields are added to the user? What about if your app now needs to be consumed over SOAP instead of just REST?
In most TypeScript apps we've seen this involves tracing down every consumer of the 'entity' and modifying them to also validate on load/read, update mappings and update datastores DML.

In an ideal world, updating the source of truth for an entity (it's class) should also update its downstream consumers with minimal effort.

## Objective 

Create a single domain entity that can be utilized for any transport and any datastore. 
The methods added by `Entity.Base` should simplify only mapping, validation or other repetitive tasks.


## Define an Entity

```typescript
import {Entity} from 'designed'

class Person extends Entity.Base {
  // This will be available in autocomplete when `Person.create` 
  // is called and when lookups or serialization occur.
  @Entity.Field()
  name: string
  
  // Will never be exposed through `Entity` class methods. 
  // It is both private and not marked with `@Entity.Field()`
  private password: string
}
```

## Map data into a `Person` object

Creates a new instance of a Person from a data blob.

The following all result in `Person(name: 'Persons Name')`

### Direct Mapping

Data that maps fields can be mapped to directly without a `.mapping` parameter. Only fields annotated with `@Entity.Field` will be written to prevent mass assignment.

```typescript
Person.build({
  data: {
    name: 'Persons Name'
  }
})
```


### Simple Mapping

If the name of an attribute is not the same it can be mapped simply by naming the correct key in the mapping field.

```typescript
Person.build({
  data: {
    TheName: 'Persons Name'
  },
  mapping: {
    name: 'TheName'
  }
})
```

### Function Mapping

Both the new instance and the data that is being mapped are available in a setter function that will be invoked once to assign the value.

```typescript
Person.build({
  data: {
    attribute: 'Persons Name'
  },
  mapping: {
    name: ({ instance, data }) => data.attribute
  }
})
```

### Dot syntax mapping

```typescript
Person.build({
  data: {
    deeply: { nested: { field: 'Persons Name'}}
  },
  mapping: {
    name: 'deeply.nested.field'
  }
})
```

## Validation

Designed does not implement it's own validation system and out of the box no validation will occur. It is up to you to provide a function that takes an entity and throws an error if it is invalid. 

In practice this means you can choose between [class-validator](https://github.com/typestack/class-validator), [joi](https://github.com/sideway/joi), or any other validation system you would like.

We have used [class-validator](https://github.com/typestack/class-validator) and found it to be the simplest to integrate with this module.

```typescript
```
