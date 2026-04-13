const jwt = require("jsonwebtoken");
const User = require("../../src/models/userModel");
const { protect, authorize } = require("../../src/middleware/authMiddleware");

jest.mock("jsonwebtoken");
jest.mock("../../src/models/userModel");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  describe("protect", () => {
    test("should return 401 if no token is provided", async () => {
      const req = { headers: {} };
      const res = mockResponse();
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if authorization header does not start with Bearer", async () => {
      const req = { headers: { authorization: "Token abc123" } };
      const res = mockResponse();
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if token verification fails", async () => {
      const req = { headers: { authorization: "Bearer badtoken" } };
      const res = mockResponse();
      const next = jest.fn();

      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("badtoken", "testsecret");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if decoded token user is not found", async () => {
      const req = { headers: { authorization: "Bearer goodtoken" } };
      const res = mockResponse();
      const next = jest.fn();

      jwt.verify.mockReturnValue({ id: "u1" });

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should attach user to req and call next for valid token", async () => {
      const req = { headers: { authorization: "Bearer goodtoken" } };
      const res = mockResponse();
      const next = jest.fn();

      const user = {
        _id: "u1",
        name: "Admin User",
        email: "admin@test.com",
        role: "pho_admin"
      };

      jwt.verify.mockReturnValue({ id: "u1" });

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(user)
      });

      await protect(req, res, next);

      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(401);
    });
  });

  describe("authorize", () => {
    test("should return 403 if user role is not allowed", () => {
      const req = {
        user: { role: "user" }
      };
      const res = mockResponse();
      const next = jest.fn();

      authorize("pho_admin")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next if user role is allowed", () => {
      const req = {
        user: { role: "pho_admin" }
      };
      const res = mockResponse();
      const next = jest.fn();

      authorize("pho_admin")(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(403);
    });

    test("should allow multiple accepted roles", () => {
      const req = {
        user: { role: "user" }
      };
      const res = mockResponse();
      const next = jest.fn();

      authorize("pho_admin", "user")(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});