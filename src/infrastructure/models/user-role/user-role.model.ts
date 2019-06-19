import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

interface UserRoleModelProps {
  id: string;
  name: string;
}

@Entity({
  name: "UserRoles",
})
export class UserRoleModel {
  public static create(data: Partial<UserRoleModelProps>): UserRoleModel {
    const entity = new UserRoleModel();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}
