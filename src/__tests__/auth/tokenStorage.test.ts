import * as SecureStore from "expo-secure-store";
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "@auth/tokenStorage";

jest.mock("expo-secure-store");

const mockedStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe("tokenStorage", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("saveTokens", () => {
    it("saves access token", async () => {
      await saveTokens({ accessToken: "access-123" });

      expect(mockedStore.setItemAsync).toHaveBeenCalledWith(
        "sg_access_token",
        "access-123"
      );
    });

    it("saves refresh and id tokens when provided", async () => {
      await saveTokens({
        accessToken: "access-123",
        refreshToken: "refresh-456",
        idToken: "id-789",
      });

      expect(mockedStore.setItemAsync).toHaveBeenCalledTimes(3);
      expect(mockedStore.setItemAsync).toHaveBeenCalledWith(
        "sg_refresh_token",
        "refresh-456"
      );
      expect(mockedStore.setItemAsync).toHaveBeenCalledWith(
        "sg_id_token",
        "id-789"
      );
    });

    it("skips optional tokens when not provided", async () => {
      await saveTokens({ accessToken: "access-123" });

      expect(mockedStore.setItemAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAccessToken", () => {
    it("returns token when stored", async () => {
      mockedStore.getItemAsync.mockResolvedValue("access-123");

      const token = await getAccessToken();

      expect(token).toBe("access-123");
      expect(mockedStore.getItemAsync).toHaveBeenCalledWith("sg_access_token");
    });

    it("returns null when no token stored", async () => {
      mockedStore.getItemAsync.mockResolvedValue(null);

      const token = await getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe("getRefreshToken", () => {
    it("returns refresh token when stored", async () => {
      mockedStore.getItemAsync.mockResolvedValue("refresh-456");

      const token = await getRefreshToken();

      expect(token).toBe("refresh-456");
      expect(mockedStore.getItemAsync).toHaveBeenCalledWith(
        "sg_refresh_token"
      );
    });
  });

  describe("clearTokens", () => {
    it("deletes all token keys", async () => {
      await clearTokens();

      expect(mockedStore.deleteItemAsync).toHaveBeenCalledWith(
        "sg_access_token"
      );
      expect(mockedStore.deleteItemAsync).toHaveBeenCalledWith(
        "sg_refresh_token"
      );
      expect(mockedStore.deleteItemAsync).toHaveBeenCalledWith(
        "sg_id_token"
      );
      expect(mockedStore.deleteItemAsync).toHaveBeenCalledTimes(3);
    });
  });
});
