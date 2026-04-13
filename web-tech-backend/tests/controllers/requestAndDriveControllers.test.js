const Request = require("../../src/models/requestModel");
const Donor = require("../../src/models/donorModel");
const RequestParticipant = require("../../src/models/requestParticipantModel");
const DonationDrive = require("../../src/models/donationDriveModel");
const DriveParticipant = require("../../src/models/driveParticipantModel");

const {
  createRequest,
  getAllRequests,
  updateRequestById,
  deleteRequestById
} = require("../../src/controllers/requestController");

const {
  createDrive,
  getAllDrives,
  updateDriveById,
  deleteDriveById
} = require("../../src/controllers/driveController");

jest.mock("../../src/models/requestModel");
jest.mock("../../src/models/donorModel");
jest.mock("../../src/models/requestParticipantModel");
jest.mock("../../src/models/donationDriveModel");
jest.mock("../../src/models/driveParticipantModel");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("requestController and driveController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createRequest should validate required fields", async () => {
    const req = { body: {}, user: { _id: "admin1" } };
    const res = mockResponse();

    await createRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("createRequest should create request", async () => {
    const req = {
      user: { _id: "admin1" },
      body: {
        title: "Need O+",
        bloodType: "O+",
        urgency: "high",
        venue: "MPH",
        date: "2026-01-01",
        startTime: "8:00 AM"
      }
    };
    const res = mockResponse();

    Request.create.mockResolvedValue({ _id: "r1" });

    await createRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getAllRequests should return formatted requests for donor user", async () => {
    const req = { query: { page: "1", limit: "10" }, user: { _id: "u1", role: "user" } };
    const res = mockResponse();

    Request.countDocuments.mockResolvedValue(1);

    const requestDoc = {
      _id: "r1",
      toObject: () => ({ _id: "r1", title: "Need O+" })
    };

    Request.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([requestDoc])
          })
        })
      })
    });

    Donor.findOne.mockResolvedValue({ _id: "d1" });
    RequestParticipant.find.mockResolvedValue([
      { requestId: "r1", donorId: "d1", status: "joined" }
    ]);

    await getAllRequests(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data[0].hasJoined).toBe(true);
  });

  test("updateRequestById should return 404 if request not found", async () => {
    const req = { params: { id: "r1" }, body: {} };
    const res = mockResponse();

    Request.findById.mockResolvedValue(null);

    await updateRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateRequestById should update request", async () => {
    const req = {
      params: { id: "r1" },
      body: { title: "Updated Title", description: "Updated" }
    };
    const res = mockResponse();

    const requestDoc = {
      title: "Old",
      description: "Old",
      maxParticipants: 0,
      bloodType: "O+",
      urgency: "high",
      status: "Pending",
      venue: "MPH",
      date: "2026-01-01",
      startTime: "8:00 AM",
      save: jest.fn().mockResolvedValue({ _id: "r1", title: "Updated Title" })
    };

    Request.findById.mockResolvedValue(requestDoc);

    await updateRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("deleteRequestById should delete request", async () => {
    const req = { params: { id: "r1" } };
    const res = mockResponse();

    const requestDoc = { deleteOne: jest.fn().mockResolvedValue() };
    Request.findById.mockResolvedValue(requestDoc);

    await deleteRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("createDrive should validate required fields", async () => {
    const req = { body: {}, user: { _id: "admin1" } };
    const res = mockResponse();

    await createDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("createDrive should create drive with uploaded image", async () => {
    const req = {
      user: { _id: "admin1" },
      file: { filename: "sample.jpg" },
      body: {
        title: "Drive 1",
        location: "Boac",
        date: "2026-01-01",
        time: "8:00 AM"
      }
    };
    const res = mockResponse();

    DonationDrive.create.mockResolvedValue({ _id: "d1" });

    await createDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(DonationDrive.create.mock.calls[0][0].imageURL).toContain("sample.jpg");
  });

  test("getAllDrives should return formatted drives", async () => {
    const req = { query: { page: "1", limit: "10" }, user: { _id: "u1", role: "user" } };
    const res = mockResponse();

    DonationDrive.countDocuments.mockResolvedValue(1);

    const driveDoc = {
      _id: "dr1",
      toObject: () => ({ _id: "dr1", title: "Drive 1" })
    };

    DonationDrive.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([driveDoc])
          })
        })
      })
    });

    Donor.findOne.mockResolvedValue({ _id: "don1" });
    DriveParticipant.find.mockResolvedValue([
      { driveId: "dr1", donorId: "don1", status: "joined" }
    ]);

    await getAllDrives(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data[0].hasJoined).toBe(true);
  });

  test("updateDriveById should return 404 if drive not found", async () => {
    const req = { params: { id: "dr1" }, body: {} };
    const res = mockResponse();

    DonationDrive.findById.mockResolvedValue(null);

    await updateDriveById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateDriveById should update drive", async () => {
    const req = {
      params: { id: "dr1" },
      body: { title: "Updated Drive" }
    };
    const res = mockResponse();

    const driveDoc = {
      title: "Old",
      location: "Boac",
      date: "2026-01-01",
      time: "8:00 AM",
      description: "",
      maxParticipants: null,
      status: "Upcoming",
      imageURL: "",
      save: jest.fn().mockResolvedValue({ _id: "dr1", title: "Updated Drive" })
    };

    DonationDrive.findById.mockResolvedValue(driveDoc);

    await updateDriveById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("deleteDriveById should delete drive", async () => {
    const req = { params: { id: "dr1" } };
    const res = mockResponse();

    const driveDoc = { deleteOne: jest.fn().mockResolvedValue() };
    DonationDrive.findById.mockResolvedValue(driveDoc);

    await deleteDriveById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});