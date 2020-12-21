import { ProfileModelGeneric } from "../models/profile.model";

export interface ProfileRepository {
  addProfile: (profile: ProfileModelGeneric) => Promise<ProfileModelGeneric>;
  findByUsername: (username: string) => Promise<ProfileModelGeneric | undefined>;
  findById: (id: string) => Promise<ProfileModelGeneric | undefined>;
  save: (profile: ProfileModelGeneric) => Promise<ProfileModelGeneric>;
  delete: (ids: string[]) => Promise<any>;
}
