import { apiClient } from "../../../core/network/apiClient";
import { ICreateUserProfileInput, IUserProfile } from "../../../domain/models/profile";




export const profileRepository = {
  async get(): Promise<IUserProfile> {
    const { data } = await apiClient.get<IUserProfile>("/user-profile");
    return data;
  },

  async create(payload: ICreateUserProfileInput): Promise<IUserProfile> {
    const { data } = await apiClient.post<IUserProfile>("/user-profile", payload);
    return data;
  },

  async update(payload: Partial<IUserProfile>): Promise<IUserProfile> {
    const { data } = await apiClient.put<IUserProfile>("/user-profile", payload);
    return data;
  },
};