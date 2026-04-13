const Donor = require("../../src/models/donorModel");
const {
  createDonorProfile,
  createManualDonor
} = require("../../src/controllers/donorController");

jest.mock("../../src/models/donorModel");
jest.mock("../../src/models/userModel", () => ({}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("donorController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createDonorProfile", () => {
    test("should return 400 if donor profile already exists", async () => {
      const req = {
        user: { _id: "user1" },
        body: {}
      };
      const res = mockResponse();

      Donor.findOne.mockResolvedValue({ _id: "d1" });

      await createDonorProfile(req, res);

      expect(Donor.findOne).toHaveBeenCalledWith({ userId: "user1" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Donor profile already exists for this user"
      });
    });

    test("should create donor profile with defaults", async () => {
      const req = {
        user: { _id: "user1" },
        body: {}
      };
      const res = mockResponse();

      const createdDonor = {
        _id: "d1",
        fullName: "",
        userId: "user1",
        isRegisteredUser: true,
        bloodType: "unknown",
        address: "",
        contactNumber: "",
        lastDonationDate: null,
        isProfileComplete: false
      };

      Donor.findOne.mockResolvedValue(null);
      Donor.create.mockResolvedValue(createdDonor);

      await createDonorProfile(req, res);

      expect(Donor.create).toHaveBeenCalledWith({
        fullName: "",
        userId: "user1",
        isRegisteredUser: true,
        bloodType: "unknown",
        address: "",
        contactNumber: "",
        lastDonationDate: null,
        isProfileComplete: false
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Donor profile created successfully",
        donor: createdDonor
      });
    });

    test("should create complete donor profile when all fields are present", async () => {
      const req = {
        user: { _id: "user1" },
        body: {
          bloodType: "O+",
          address: "Boac",
          contactNumber: "09123456789",
          lastDonationDate: "2026-01-01"
        }
      };
      const res = mockResponse();

      const createdDonor = { _id: "d1" };

      Donor.findOne.mockResolvedValue(null);
      Donor.create.mockResolvedValue(createdDonor);

      await createDonorProfile(req, res);

      expect(Donor.create).toHaveBeenCalledWith({
        fullName: "",
        userId: "user1",
        isRegisteredUser: true,
        bloodType: "O+",
        address: "Boac",
        contactNumber: "09123456789",
        lastDonationDate: "2026-01-01",
        isProfileComplete: true
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("should return 500 when create donor profile fails", async () => {
      const req = {
        user: { _id: "user1" },
        body: {}
      };
      const res = mockResponse();

      Donor.findOne.mockRejectedValue(new Error("DB error"));

      await createDonorProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to create donor profile",
        error: "DB error"
      });
    });
  });

  describe("createManualDonor", () => {
    test("should return 400 if full name is missing", async () => {
      const req = { body: {} };
      const res = mockResponse();

      await createManualDonor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Full name is required for manual donor creation"
      });
    });

    test("should create manual donor with defaults", async () => {
      const req = {
        body: {
          fullName: "Maria Santos"
        }
      };
      const res = mockResponse();

      const createdDonor = { _id: "d2" };
      Donor.create.mockResolvedValue(createdDonor);

      await createManualDonor(req, res);

      expect(Donor.create).toHaveBeenCalledWith({
        fullName: "Maria Santos",
        userId: null,
        isRegisteredUser: false,
        bloodType: "unknown",
        address: "",
        contactNumber: "",
        lastDonationDate: null,
        isProfileComplete: false
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Manual donor created successfully",
        donor: createdDonor
      });
    });

    test("should create complete manual donor profile", async () => {
      const req = {
        body: {
          fullName: "Maria Santos",
          bloodType: "A+",
          address: "Gasan",
          contactNumber: "09999999999",
          lastDonationDate: "2026-02-01"
        }
      };
      const res = mockResponse();

      Donor.create.mockResolvedValue({ _id: "d3" });

      await createManualDonor(req, res);

      expect(Donor.create).toHaveBeenCalledWith({
        fullName: "Maria Santos",
        userId: null,
        isRegisteredUser: false,
        bloodType: "A+",
        address: "Gasan",
        contactNumber: "09999999999",
        lastDonationDate: "2026-02-01",
        isProfileComplete: true
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("should return 500 when manual donor creation fails", async () => {
      const req = {
        body: { fullName: "Maria Santos" }
      };
      const res = mockResponse();

      Donor.create.mockRejectedValue(new Error("DB error"));

      await createManualDonor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to create manual donor",
        error: "DB error"
      });
    });
  });
});