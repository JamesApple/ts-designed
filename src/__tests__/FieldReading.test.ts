import {Entity} from "..";

describe("FieldReading", function () {
  class Address extends Entity.Base {
    @Entity.Field()
    postcode: number;
  }

  class Person extends Entity.Base {
    @Entity.Field()
    name?: string;

    @Entity.Field({entity: Address})
    address: Address;
  }

  it("returns all fields for the class", async function () {
    const fields = Person.fields().all();
    expect(fields[1].entityConstructor).toEqual(Address);
    expect(fields).toMatchInlineSnapshot(`
      Array [
        Object {
          "entityConstructor": undefined,
          "fieldArrayLike": false,
          "name": "name",
          "subFields": undefined,
        },
        Object {
          "entityConstructor": [Function],
          "fieldArrayLike": false,
          "name": "address",
          "subFields": Array [
            Object {
              "entityConstructor": undefined,
              "fieldArrayLike": false,
              "name": "postcode",
              "subFields": undefined,
            },
          ],
        },
      ]
    `);
  });

  it("returns all set fields for an entity", async function () {
    const person = Person.create({
      name: "Bob",
      address: Address.create({postcode: 1})
    });
    expect(person.fields().onlySet()).toMatchInlineSnapshot(`
      Array [
        Object {
          "entityConstructor": undefined,
          "fieldArrayLike": false,
          "name": "name",
          "subFields": undefined,
        },
        Object {
          "entityConstructor": [Function],
          "fieldArrayLike": false,
          "name": "address",
          "subFields": Array [
            Object {
              "entityConstructor": undefined,
              "fieldArrayLike": false,
              "name": "postcode",
              "subFields": undefined,
            },
          ],
        },
      ]
    `);
  });

  it("returns all unset fields for an entity", async function () {
    const person = Person.create({
      name: "Bob",
      address: Address.create({postcode: 1})
    });
    expect(person.fields().onlyUnset()).toMatchInlineSnapshot(`Array []`);
    delete person.name;
    expect(person.fields().onlyUnset()).toMatchInlineSnapshot(`
      Array [
        Object {
          "entityConstructor": undefined,
          "fieldArrayLike": false,
          "name": "name",
          "subFields": undefined,
        },
      ]
    `);
  });
});
