import { EntityRepository, Repository } from "typeorm";
import { ProfileModel, ProfileModelGeneric } from "../../models/profile.model";
import { ProfileRepository } from "../profile.repostiory";

@EntityRepository(ProfileModel)
export class ProfileTypeormRepository extends Repository<ProfileModel> implements ProfileRepository {
  public async addProfile(profile: ProfileModelGeneric) {
    return this.save(profile);
  }

  public async findByUsername(username: string) {
    return this.findOne({ where: { username } });
  }

  public async findById(id: string) {
    return this.findOne({ where: { id } });
  }

  public delete(ids: string[]) {
    return super.delete(ids);
  }
}
