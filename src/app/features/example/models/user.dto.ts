import { Exclude, Expose } from "class-transformer";

interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
}

@Exclude()
export class User {
  public static create(data: Partial<UserProps>): User {
    const object = new User();
    Object.assign(object, data);
    return object;
  }

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  email: string;
}
