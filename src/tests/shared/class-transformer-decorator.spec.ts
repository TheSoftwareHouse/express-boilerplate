/* eslint-disable max-classes-per-file */
import { expect } from "chai";
import { classToPlain, Exclude, Expose } from "class-transformer";

interface DtoExampleProps {
  username: string;
  password: string;
}

@Expose()
export class DtoExample {
  public static create(data: Partial<DtoExampleProps>): DtoExample {
    const object = new DtoExample();
    Object.assign(object, data);
    return object;
  }

  username: string;

  @Exclude()
  password: string;
}

describe("Class Transformer Decorators", () => {
  it("return exposed fields only", async () => {
    const exampleClass = DtoExample.create({ username: "example", password: "password" });
    const plainObject = classToPlain(exampleClass);

    expect(plainObject).to.eql({ username: "example" });
  });
});
