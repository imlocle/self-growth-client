import { apiClient } from "@core/network/apiClient";
import * as authApi from "@auth/authApi";

jest.mock("@core/network/apiClient");

const mockedClient = apiClient as jest.Mocked<typeof apiClient>;

describe("authApi", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("signup", () => {
    it("posts to /auth/signup with payload", async () => {
      mockedClient.post.mockResolvedValue({ data: { message: "ok" } });

      const payload = {
        email: "test@example.com",
        password: "Pass123!",
        firstName: "Alex",
      };
      await authApi.signup(payload);

      expect(mockedClient.post).toHaveBeenCalledWith(
        "/auth/signup",
        payload
      );
    });
  });

  describe("confirmSignup", () => {
    it("posts to /auth/confirmSignup with payload", async () => {
      mockedClient.post.mockResolvedValue({ data: { message: "ok" } });

      const payload = { email: "test@example.com", confirmationCode: "123456" };
      await authApi.confirmSignup(payload);

      expect(mockedClient.post).toHaveBeenCalledWith(
        "/auth/confirmSignup",
        payload
      );
    });
  });

  describe("login", () => {
    it("posts to /auth/login and returns tokens", async () => {
      const tokens = {
        accessToken: "access-123",
        refreshToken: "refresh-456",
        idToken: "id-789",
      };
      mockedClient.post.mockResolvedValue({ data: tokens });

      const result = await authApi.login({
        email: "test@example.com",
        password: "Pass123!",
      });

      expect(result).toEqual(tokens);
      expect(mockedClient.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "Pass123!",
      });
    });
  });
});
