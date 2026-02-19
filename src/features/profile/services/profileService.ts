import { ICreateUserProfileInput, IUserProfile } from "@domain/models/profile";
import { profileRepository } from "../repositories/profileRepository";

export const profileService = {
  async getOrCreate(payload: ICreateUserProfileInput): Promise<IUserProfile> {
    try {
      return await profileRepository.get();
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return profileRepository.create(payload);
      }
      throw err;
    }
  },

  async get(): Promise<IUserProfile> {
    return profileRepository.get();
  },

  async create(payload: ICreateUserProfileInput): Promise<IUserProfile> {
    return profileRepository.create(payload);
  },

  async update(payload: Partial<IUserProfile>): Promise<IUserProfile> {
    return profileRepository.update(payload);
  },
};
