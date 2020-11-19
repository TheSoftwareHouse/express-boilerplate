import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

export interface ProfileModelProps {
  username: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  isAdult?: boolean;
}

export interface ProfileModelGeneric extends ProfileModelProps {
  id?: string;
  create?(data: Partial<ProfileModelProps>): ProfileModelGeneric;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity({
  name: "Profile",
})
export class ProfileModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  isActive: boolean;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isAdult: boolean;
}

export const createUserModel = (data: Partial<ProfileModelProps>) => {
  const entity = new ProfileModel();
  Object.assign(entity, data);
  return entity;
};
