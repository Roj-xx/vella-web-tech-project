const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/userModel");
const { registerUser, loginUser } = require("../../src/controllers/authController");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../src/models/userModel");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  describe("registerUser", () => {
    test("should return 400 if name, email, or password is missing", async () => {
      const req = { body: {} };
      const res = mockResponse();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Name, email, and password are required"
      });
    });

    test("should return 400 if email is already registered", async () => {
      const req = {
        body: { name: "John", email: "john@example.com", password: "123456" }
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue({ _id: "u1" });

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email is already registered"
      });
    });

    test("should register user successfully", async () => {
      const req = {
        body: { name: "John", email: "john@example.com", password: "123456" }
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.create.mockResolvedValue({
        _id: "u1",
        name: "John",
        email: "john@example.com",
        role: "user"
      });

      await registerUser(req, res);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", "salt");
      expect(User.create).toHaveBeenCalledWith({
        name: "John",
        email: "john@example.com",
        password: "hashedPassword",
        role: "user"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: {
          id: "u1",
          name: "John",
          email: "john@example.com",
          role: "user"
        }
      });
    });

    test("should return 500 when registration fails", async () => {
      const req = {
        body: { name: "John", email: "john@example.com", password: "123456" }
      };
      const res = mockResponse();

      User.findOne.mockRejectedValue(new Error("DB error"));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Registration failed",
        error: "DB error"
      });
    });
  });

  describe("loginUser", () => {
    test("should return 400 if email or password is missing", async () => {
      const req = { body: {} };
      const res = mockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required"
      });
    });

    test("should return 401 if user is not found", async () => {
      const req = {
        body: { email: "john@example.com", password: "123456" }
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password"
      });
    });

    test("should return 401 if password does not match", async () => {
      const req = {
        body: { email: "john@example.com", password: "wrongpass" }
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue({
        _id: "u1",
        name: "John",
        email: "john@example.com",
        password: "hashedPassword",
        role: "user"
      });
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashedPassword");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password"
      });
    });

    test("should login successfully and return token", async () => {
      const req = {
        body: { email: "john@example.com", password: "123456" }
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue({
        _id: "u1",
        name: "John",
        email: "john@example.com",
        password: "hashedPassword",
        role: "user"
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mocked-token");

      await loginUser(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: "u1",
          role: "user",
          email: "john@example.com"
        },
        "testsecret",
        { expiresIn: "7d" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "mocked-token",
        user: {
          id: "u1",
          name: "John",
          email: "john@example.com",
          role: "user"
        }
      });
    });

    test("should return 500 when login fails unexpectedly", async () => {
      const req = {
        body: { email: "john@example.com", password: "123456" }
      };
      const res = mockResponse();

      User.findOne.mockRejectedValue(new Error("DB error"));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login failed",
        error: "DB error"
      });
    });
  });
});