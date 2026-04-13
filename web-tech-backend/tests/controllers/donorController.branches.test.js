const Donor = require("../../src/models/donorModel");
const {
  getAllDonors,
  getMyDonorProfile,
  updateDonorById,
  deleteDonorById,
  updateMyDonorProfile
} = require("../../src/controllers/donorController");

jest.mock("../../src/models/donorModel");
jest.mock("../../src/models/userModel", () => ({}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("donorController branch coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAllDonors should return all when includeUnknown is true", async () => {
    const req = {
      query: {
        page: "1",
        limit: "10",
        includeUnknown: "true"
      }
    };
    const res = mockResponse();

    const donors = [
      {
        _id: "d1",
        userId: null,
        fullName: "Manual Donor",
        isRegisteredUser: false,
        bloodType: "unknown",
        address: "",
        contactNumber: "",
        lastDonationDate: null,
        isProfileComplete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    Donor.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(donors)
      })
    });

    await getAllDonors(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data[0].displayName).toBe("Manual Donor");
  });

  test("getAllDonors should return empty result", async () => {
    const req = {
      query: {
        page: "1",
        limit: "10",
        search: "nomatch"
      }
    };
    const res = mockResponse();

    Donor.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      })
    });

    await getAllDonors(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].totalItems).toBe(0);
  });

  test("getMyDonorProfile should handle error", async () => {
    const req = { user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getMyDonorProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("updateDonorById should not overwrite registered user's name from fullName", async () => {
    const req = {
      params: { id: "d1" },
      body: {
        fullName: "Should Not Apply",
        bloodType: "B+",
        address: "Santa Cruz",
        contactNumber: "09999",
        lastDonationDate: "2026-01-01"
      }
    };
    const res = mockResponse();

    const donor = {
      _id: "d1",
      userId: "u1",
      fullName: "",
      bloodType: "unknown",
      address: "",
      contactNumber: "",
      lastDonationDate: null,
      save: jest.fn().mockResolvedValue({
        _id: "d1",
        fullName: "",
        bloodType: "B+",
        address: "Santa Cruz",
        contactNumber: "09999",
        lastDonationDate: "2026-01-01",
        isProfileComplete: true
      })
    };

    Donor.findById.mockResolvedValue(donor);

    await updateDonorById(req, res);

    expect(donor.fullName).toBe("");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updateDonorById should handle error", async () => {
    const req = { params: { id: "d1" }, body: {} };
    const res = mockResponse();

    Donor.findById.mockRejectedValue(new Error("DB error"));

    await updateDonorById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("deleteDonorById should handle error", async () => {
    const req = { params: { id: "d1" } };
    const res = mockResponse();

    Donor.findById.mockRejectedValue(new Error("DB error"));

    await deleteDonorById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("updateMyDonorProfile should handle error", async () => {
    const req = { user: { _id: "u1" }, body: {} };
    const res = mockResponse();

    Donor.findOne.mockRejectedValue(new Error("DB error"));

    await updateMyDonorProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});