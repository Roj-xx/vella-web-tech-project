const DonationDrive = require("../../src/models/donationDriveModel");
const Donor = require("../../src/models/donorModel");
const DriveParticipant = require("../../src/models/driveParticipantModel");

const {
  joinDrive,
  getDriveParticipants,
  updateDriveParticipantStatus,
  cancelMyDriveParticipation,
  addManualDriveParticipant
} = require("../../src/controllers/driveParticipantController");

jest.mock("../../src/models/donationDriveModel");
jest.mock("../../src/models/donorModel");
jest.mock("../../src/models/driveParticipantModel");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("driveParticipantController branch coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("joinDrive should return 400 if donor profile is incomplete", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: false
    });

    await joinDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("joinDrive should return 404 if drive not found", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true
    });
    DonationDrive.findById.mockResolvedValue(null);

    await joinDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("joinDrive should return 400 if participant already joined", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true
    });
    DonationDrive.findById.mockResolvedValue({
      _id: "dr1",
      status: "Upcoming",
      maxParticipants: 5
    });
    DriveParticipant.findOne.mockResolvedValue({
      _id: "dp1",
      status: "joined"
    });

    await joinDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("joinDrive should rejoin if previous participant was cancelled", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    const existingParticipant = {
      _id: "dp1",
      status: "cancelled",
      save: jest.fn().mockResolvedValue({
        _id: "dp1",
        status: "joined"
      })
    };

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true
    });
    DonationDrive.findById.mockResolvedValue({
      _id: "dr1",
      status: "Upcoming",
      maxParticipants: 5
    });
    DriveParticipant.findOne.mockResolvedValue(existingParticipant);
    DriveParticipant.countDocuments.mockResolvedValue(0);

    await joinDrive(req, res);

    expect(existingParticipant.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("joinDrive should return 400 if participant limit reached", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true
    });
    DonationDrive.findById.mockResolvedValue({
      _id: "dr1",
      status: "Upcoming",
      maxParticipants: 1
    });
    DriveParticipant.findOne.mockResolvedValue(null);
    DriveParticipant.countDocuments.mockResolvedValue(1);

    await joinDrive(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getDriveParticipants should return participant list", async () => {
    const req = { params: { id: "dr1" } };
    const res = mockResponse();

    DonationDrive.findById.mockResolvedValue({
        _id: "dr1",
        title: "Drive 1"
    });

    DriveParticipant.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
            {
            _id: "dp1",
            driveId: "dr1",
            status: "joined",
            registeredAt: new Date(),
            attendedAt: null,
            donorId: {
                _id: "d1",
                userId: { name: "Juan", email: "juan@test.com", role: "user" },
                fullName: "",
                isRegisteredUser: true,
                bloodType: "O+",
                address: "Boac",
                contactNumber: "09123",
                lastDonationDate: null,
                isProfileComplete: true
            }
            }
        ])
        })
    });

    await getDriveParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    });

  test("updateDriveParticipantStatus should return 404 if participant not found", async () => {
    const req = {
      params: { id: "dp1" },
      body: { status: "attended" }
    };
    const res = mockResponse();

    DriveParticipant.findById.mockResolvedValue(null);

    await updateDriveParticipantStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateDriveParticipantStatus should set attendedAt when attended", async () => {
    const req = {
      params: { id: "dp1" },
      body: { status: "attended" }
    };
    const res = mockResponse();

    const participant = {
      _id: "dp1",
      status: "joined",
      attendedAt: null,
      save: jest.fn().mockResolvedValue({
        _id: "dp1",
        status: "attended",
        attendedAt: new Date()
      })
    };

    DriveParticipant.findById.mockResolvedValue(participant);

    await updateDriveParticipantStatus(req, res);

    expect(participant.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("cancelMyDriveParticipation should return 400 if status is not joined", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({ _id: "d1" });
    DriveParticipant.findOne.mockResolvedValue({
      _id: "dp1",
      status: "attended"
    });

    await cancelMyDriveParticipation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("cancelMyDriveParticipation should cancel joined participation", async () => {
    const req = { params: { id: "dr1" }, user: { _id: "u1" } };
    const res = mockResponse();

    const participant = {
      _id: "dp1",
      status: "joined",
      save: jest.fn().mockResolvedValue({
        _id: "dp1",
        status: "cancelled"
      })
    };

    Donor.findOne.mockResolvedValue({ _id: "d1" });
    DriveParticipant.findOne.mockResolvedValue(participant);

    await cancelMyDriveParticipation(req, res);

    expect(participant.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("addManualDriveParticipant should return 404 if drive not found", async () => {
    const req = {
      params: { id: "dr1" },
      body: { donorId: "d1" }
    };
    const res = mockResponse();

    DonationDrive.findById.mockResolvedValue(null);

    await addManualDriveParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("addManualDriveParticipant should return 404 if donor not found", async () => {
    const req = {
        params: { id: "dr1" },
        body: { donorId: "d1" }
    };
    const res = mockResponse();

    DonationDrive.findById.mockResolvedValue({
        _id: "dr1",
        status: "Upcoming",
        maxParticipants: 5
    });

    Donor.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
    });

    await addManualDriveParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    });

  test("addManualDriveParticipant should return 400 if donor profile incomplete", async () => {
    const req = {
      params: { id: "dr1" },
      body: { donorId: "d1" }
    };
    const res = mockResponse();

    DonationDrive.findById.mockResolvedValue({
      _id: "dr1",
      maxParticipants: 5
    });
    Donor.findById.mockResolvedValue({
      _id: "d1",
      isProfileComplete: false
    });

    await addManualDriveParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("addManualDriveParticipant should return 400 if donor already added", async () => {
    const req = {
      params: { id: "dr1" },
      body: { donorId: "d1" }
    };
    const res = mockResponse();

    DonationDrive.findById.mockResolvedValue({
      _id: "dr1",
      maxParticipants: 5
    });
    Donor.findById.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true
    });
    DriveParticipant.findOne.mockResolvedValue({
      _id: "dp1",
      status: "joined"
    });

    await addManualDriveParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});