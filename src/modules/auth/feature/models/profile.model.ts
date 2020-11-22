import { Column, Entity, PrimaryColumn } from "typeorm";

interface ProfileModelProps {
  id: string;
  name: string;
}

@Entity({
  name: "profiles",
})
export class ProfileModel {
  public static create(data: Partial<ProfileModelProps>): ProfileModel {
    const entity = new ProfileModel();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}
