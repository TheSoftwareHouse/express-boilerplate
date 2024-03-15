import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Entity({
  name: "user",
})
export class UserEntity {
  public static create(data: Partial<UserProps>): UserEntity {
    const object = new UserEntity();
    Object.assign(object, data);
    return object;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;
}
