/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";
import {Entity} from "..";

class Email {
  constructor(private value: string) {}

  static fromJSON(s: string) {
    return new Email(s);
  }

  toString() {
    return `BSB{${this.value}}`;
  }

  asJSON() {
    return this.value;
  }
}

class Parent extends Entity.Base {
  @Entity.Field()
  email?: Email;
}

describe("Value object mapping", function () {
  it("should create the email from a string", async function () {
    const e = Parent.create({
      email: "jim@bob.com"
    });

    expect(e.email).toBeInstanceOf(Email);
    expect(e.email?.asJSON()).toEqual("jim@bob.com");
  });

  it("should create the email from the passed entity", async function () {
    const email = Email.fromJSON("jim@bob.com");
    const e = Parent.create({
      email
    });

    expect(e.email).toBeInstanceOf(Email);
    expect(e.email?.asJSON()).toEqual("jim@bob.com");
  });

  it("should output the correct value for the value object", async function () {
    const e = Parent.create({
      email: "jim@bob.com"
    });

    expect(e.asJSON()).toEqual({email: "jim@bob.com"});
  });

  xit("should not accept invalid types", async function () {
    Parent.create({
      // @ts-expect-error Should not accept a number
      email: 123
    });

    Parent.create({
      // @ts-expect-error Should not accept an invalid raw object
      email: {value: "value"}
    });
  });
});
