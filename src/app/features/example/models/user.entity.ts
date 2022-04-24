import { Exclude, Expose } from "class-transformer";

interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
}

@Exclude()
export class UserEntity {
  public static create(data: Partial<UserProps>): UserEntity {
    const object = new UserEntity();
    Object.assign(object, data);
    return object;
  }

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  email: string;
}
