const Request = require("../../src/models/requestModel");
const Donor = require("../../src/models/donorModel");
const RequestParticipant = require("../../src/models/requestParticipantModel");
const DonationDrive = require("../../src/models/donationDriveModel");
const DriveParticipant = require("../../src/models/driveParticipantModel");

const {
  joinRequest,
  getRequestParticipants,
  updateRequestParticipantStatus,
  cancelMyRequestParticipation,
  addManualRequestParticipant
} = require("../../src/controllers/requestParticipantController");

const {
  joinDrive,
  getDriveParticipants,
  updateDriveParticipantStatus,
  cancelMyDriveParticipation,
  addManualDriveParticipant
} = require("../../src/controllers/driveParticipantController");

const { getLandingStats, getUpcomingDrives } = require("../../src/controllers/publicController");
const { getInventorySummary } = require("../../src/controllers/inventoryAnalyticsController");
const { getDashboardSummary } = require("../../src/controllers/dashboardController");

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

describe("participant and analytics controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("joinRequest should return 404 if donor profile not found", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue(null);

    await joinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("joinRequest should create participant", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({ _id: "d1", isProfileComplete: true, bloodType: "O+" });
    Request.findById.mockResolvedValue({ _id: "r1", status: "Pending", bloodType: "O+", maxParticipants: 5 });
    RequestParticipant.findOne.mockResolvedValue(null);
    RequestParticipant.countDocuments.mockResolvedValue(0);
    RequestParticipant.create.mockResolvedValue({ _id: "p1" });

    await joinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getRequestParticipants should return 404 if request not found", async () => {
    const req = { params: { id: "r1" } };
    const res = mockResponse();

    Request.findById.mockResolvedValue(null);

    await getRequestParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateRequestParticipantStatus should validate status", async () => {
    const req = { params: { id: "p1" }, body: { status: "bad" } };
    const res = mockResponse();

    await updateRequestParticipantStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("cancelMyRequestParticipation should return 404 if participant not found", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({ _id: "d1" });
    RequestParticipant.findOne.mockResolvedValue(null);

    await cancelMyRequestParticipation(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("addManualRequestParticipant should validate donorId", async () => {
    const req = { params: { id: "r1" }, body: {} };
    const res = mockResponse();

    await addManualRequestParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("joinDrive should return 404 if donor profile not found", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue(null);

    await joinDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("joinDrive should create participant", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({ _id: "d1", isProfileComplete: true });
    DonationDrive.findById.mockResolvedValue({ _id: "dr1", status: "Upcoming", maxParticipants: 5 });
    DriveParticipant.findOne.mockResolvedValue(null);
    DriveParticipant.countDocuments.mockResolvedValue(0);
    DriveParticipant.create.mockResolvedValue({ _id: "dp1" });

    await joinDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getDriveParticipants should return 404 if drive not found", async () => {
    const req = { params: { id: "dr1" } };
    const res = mockResponse();

    DonationDrive.findById.mockResolvedValue(null);

    await getDriveParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateDriveParticipantStatus should validate status", async () => {
    const req = { params: { id: "dp1" }, body: { status: "bad" } };
    const res = mockResponse();

    await updateDriveParticipantStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("cancelMyDriveParticipation should return 404 if participant not found", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({ _id: "d1" });
    DriveParticipant.findOne.mockResolvedValue(null);

    await cancelMyDriveParticipation(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("addManualDriveParticipant should validate donorId", async () => {
    const req = { params: { id: "dr1" }, body: {} };
    const res = mockResponse();

    await addManualDriveParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getLandingStats should return landing stats", async () => {
    const req = {};
    const res = mockResponse();

    Donor.countDocuments.mockResolvedValue(10);
    DonationDrive.countDocuments.mockResolvedValue(2);
    DriveParticipant.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([
        { attendedAt: new Date(), status: "attended" }
      ])
    });
    RequestParticipant.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([
        { attendedAt: new Date(), status: "attended" }
      ])
    });

    await getLandingStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getUpcomingDrives should return formatted drives", async () => {
    const req = {};
    const res = mockResponse();

    const drives = [
      {
        _id: "dr1",
        maxParticipants: 10,
        toObject: () => ({ _id: "dr1", title: "Drive 1" })
      }
    ];

    DonationDrive.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(drives)
      })
    });

    DriveParticipant.find.mockResolvedValue([
      { driveId: "dr1", status: "joined" }
    ]);

    await getUpcomingDrives(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data[0].registered).toBe(1);
  });

  test("getInventorySummary should return inventory summary", async () => {
    const req = {};
    const res = mockResponse();

    const attended = [
      {
        donorId: { bloodType: "O+" },
        attendedAt: new Date(),
        status: "attended"
      }
    ];

    DriveParticipant.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(attended)
    });

    RequestParticipant.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    });

    await getInventorySummary(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0]).toHaveProperty("summary");
  });

  test("getDashboardSummary should return dashboard summary", async () => {
    const req = {};
    const res = mockResponse();

    Donor.countDocuments.mockResolvedValue(5);
    Request.countDocuments.mockResolvedValue(2);
    DonationDrive.countDocuments.mockResolvedValue(1);

    DriveParticipant.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        { donorId: { bloodType: "O+" }, attendedAt: new Date(), status: "attended" }
      ])
    });

    RequestParticipant.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    });

    await getDashboardSummary(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0]).toHaveProperty("topCards");
  });
});