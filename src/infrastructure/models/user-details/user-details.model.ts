import { Column, Entity, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { UserRoleModel } from "../user-role/user-role.model";

interface UserDetailsModelProps {
  id: string;
  role: UserRoleModel;
  lastLogin?: Date;
  createdAt: Date;
  assignedReviews: object[];
}

@Entity({
  name: "UserDetails",
})
export class UserDetailsModel {
  public static create(data: Partial<UserDetailsModelProps>): UserDetailsModel {
    const entity = new UserDetailsModel();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryColumn()
  id: string;

  @OneToOne(() => UserRoleModel)
  @JoinColumn()
  role: UserRoleModel;

  @Column({ nullable: true, default: () => null })
  lastLogin?: Date;

  @Column({ default: () => `now()` })
  createdAt: Date;
}
