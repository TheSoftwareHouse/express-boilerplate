import { Column, Entity, PrimaryColumn } from "typeorm";

interface ProfileModelProps {
  username: string;
}

export interface ProfileModelGeneric extends ProfileModelProps {
  id?: string;
  create?(data: Partial<ProfileModelProps>): ProfileModelGeneric;
}

@Entity({
  name: "profiles",
})
export class ProfileModel {
  public static create(data: Partial<ProfileModelGeneric>): ProfileModel {
    const entity = new ProfileModel();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  username: string;
}
