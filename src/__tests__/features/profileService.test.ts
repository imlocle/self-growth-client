import { profileService } from "@features/profile/services/profileService";
import { profileRepository } from "@features/profile/repositories/profileRepository";
import { IUserProfile } from "@domain/models/profile";

jest.mock("@features/profile/repositories/profileRepository");

const mockedRepo = profileRepository as jest.Mocked<typeof profileRepository>;

const makeProfile = (overrides: Partial<IUserProfile> = {}): IUserProfile => ({
  userId: "user-1",
  firstName: "Alex",
  lastName: "Smith",
  householdId: "hh-1",
  subjectId: "sub-1",
  ...overrides,
});

describe("profileService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getOrCreate", () => {
    it("returns existing profile when found", async () => {
      const profile = makeProfile();
      mockedRepo.get.mockResolvedValue(profile);

      const result = await profileService.getOrCreate();

      expect(result).toEqual(profile);
      expect(mockedRepo.get).toHaveBeenCalled();
      expect(mockedRepo.create).not.toHaveBeenCalled();
    });

    it("creates profile when 404 is returned", async () => {
      const error = { response: { status: 404 } };
      mockedRepo.get.mockRejectedValue(error);

      const newProfile = makeProfile({ firstName: "New" });
      mockedRepo.create.mockResolvedValue(newProfile);

      const result = await profileService.getOrCreate({
        firstName: "New",
      });

      expect(result).toEqual(newProfile);
      expect(mockedRepo.create).toHaveBeenCalledWith({ firstName: "New" });
    });

    it("creates with empty payload when none provided on 404", async () => {
      const error = { response: { status: 404 } };
      mockedRepo.get.mockRejectedValue(error);
      mockedRepo.create.mockResolvedValue(makeProfile());

      await profileService.getOrCreate();

      expect(mockedRepo.create).toHaveBeenCalledWith({});
    });

    it("rethrows non-404 errors", async () => {
      const error = { response: { status: 500 } };
      mockedRepo.get.mockRejectedValue(error);

      await expect(profileService.getOrCreate()).rejects.toEqual(error);
      expect(mockedRepo.create).not.toHaveBeenCalled();
    });
  });

  describe("get", () => {
    it("delegates to repository", async () => {
      const profile = makeProfile();
      mockedRepo.get.mockResolvedValue(profile);

      const result = await profileService.get();

      expect(result).toEqual(profile);
    });
  });

  describe("create", () => {
    it("delegates to repository", async () => {
      const profile = makeProfile();
      mockedRepo.create.mockResolvedValue(profile);

      const result = await profileService.create({
        firstName: "Alex",
        lastName: "Smith",
      });

      expect(result).toEqual(profile);
      expect(mockedRepo.create).toHaveBeenCalledWith({
        firstName: "Alex",
        lastName: "Smith",
      });
    });
  });

  describe("update", () => {
    it("delegates to repository", async () => {
      const updated = makeProfile({ firstName: "Updated" });
      mockedRepo.update.mockResolvedValue(updated);

      const result = await profileService.update({ firstName: "Updated" });

      expect(result.firstName).toBe("Updated");
    });
  });
});
