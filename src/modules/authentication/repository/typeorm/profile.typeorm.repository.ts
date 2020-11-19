import { EntityRepository, Repository } from "typeorm";
import { ProfileModel, ProfileModelGeneric } from "../../models/profile.model";
import { ProfileRepository } from "../profile.repository";

@EntityRepository(ProfileModel)
export class ProfileTypeormRepository extends Repository<ProfileModel> implements ProfileRepository {
  public async addProfile(profile: ProfileModelGeneric) {
    return this.save(profile);
  }

  public async findByUsername(username: string) {
    return this.findOne({ where: { username } });
  }

  public delete(ids: string[]) {
    return super.delete(ids);
  }
}
