import {Entity} from "..";

describe("Mapping", function () {
  class Person extends Entity.Base {
    @Entity.Field()
    name: string;
  }

  class Lord extends Entity.Base {
    @Entity.Field()
    name: string;

    @Entity.Field()
    subjects: Person[];
  }

  it("mapsTo a type", async function () {
    interface storageType {
      a: {nested: {name: string}};
      same: string;
    }
    const person = Person.create({data: {name: "Bill"}});

    expect(
      person.serialize().mapTo<storageType>({
        a: {nested: {name: "name"}},
        same: "name"
      })
    ).toMatchInlineSnapshot(`
      Object {
        "a": Object {
          "nested": Object {
            "name": "Bill",
          },
        },
        "same": "Bill",
      }
    `);
  });

  it("mapsTo an existing object while preserving types", async function () {
    const person = Person.create({data: {name: "Bill"}});

    const objectWithPerson = {
      some: {
        person: Person.build()
      }
    };

    person.serialize().mapTo<typeof objectWithPerson>(
      {
        some: {person: {name: "name"}}
      },
      objectWithPerson
    );

    expect(objectWithPerson).toMatchInlineSnapshot(`
      Object {
        "some": Object {
          "person": Person {
            "name": "Bill",
          },
        },
      }
    `);
  });

  it("mapsTo using a functional parameter", async function () {
    const person = Person.create({data: {name: "0"}});
    interface SimpleObject {
      field: number;
    }

    const mapped = person.serialize().mapTo<SimpleObject>({
      field: ({instance}) => Number(instance.name)
    });

    expect(mapped.field).toEqual(0);
    expect(mapped).toMatchInlineSnapshot(`
      Object {
        "field": 0,
      }
    `);
  });

  it("performs complex mapping using map functions", async function () {
    const lord = Lord.create({
      data: {
        name: "Farquad",
        subjects: [Person.create({data: {name: "Shrek"}})]
      }
    });

    const mapped = lord.serialize().mapTo({
      serializedName: "name",
      firstPersonsName: "subjects[0].name",
      revolutionAftermath: ({instance}) => ({
        lords: instance.subjects.map((person) =>
          Lord.create({
            data: {...person, subjects: [Person.create({data: {...instance}})]}
          })
        )
      })
    });

    expect(mapped).toMatchInlineSnapshot(`
      Object {
        "firstPersonsName": "Shrek",
        "revolutionAftermath": Object {
          "lords": Array [
            Lord {
              "name": "Shrek",
              "subjects": Array [
                Person {
                  "name": "Farquad",
                },
              ],
            },
          ],
        },
        "serializedName": "Farquad",
      }
    `);
  });
});
