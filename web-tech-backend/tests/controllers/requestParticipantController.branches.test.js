const Request = require("../../src/models/requestModel");
const Donor = require("../../src/models/donorModel");
const RequestParticipant = require("../../src/models/requestParticipantModel");

const {
  joinRequest,
  getRequestParticipants,
  updateRequestParticipantStatus,
  cancelMyRequestParticipation,
  addManualRequestParticipant
} = require("../../src/controllers/requestParticipantController");

jest.mock("../../src/models/requestModel");
jest.mock("../../src/models/donorModel");
jest.mock("../../src/models/requestParticipantModel");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("requestParticipantController branch coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("joinRequest should return 400 if donor profile is incomplete", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: false,
      bloodType: "O+"
    });

    await joinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("joinRequest should return 404 if request not found", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true,
      bloodType: "O+"
    });
    Request.findById.mockResolvedValue(null);

    await joinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("joinRequest should return 400 if blood type does not match", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true,
      bloodType: "A+"
    });
    Request.findById.mockResolvedValue({
      _id: "r1",
      status: "Pending",
      bloodType: "O+",
      maxParticipants: 5
    });

    await joinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("joinRequest should return 400 if participant already joined", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true,
      bloodType: "O+"
    });
    Request.findById.mockResolvedValue({
      _id: "r1",
      status: "Pending",
      bloodType: "O+",
      maxParticipants: 5
    });
    RequestParticipant.findOne.mockResolvedValue({
      _id: "p1",
      status: "joined"
    });

    await joinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("joinRequest should rejoin if previous participant was cancelled", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    const existingParticipant = {
      _id: "p1",
      status: "cancelled",
      save: jest.fn().mockResolvedValue({
        _id: "p1",
        status: "joined"
      })
    };

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true,
      bloodType: "O+"
    });
    Request.findById.mockResolvedValue({
      _id: "r1",
      status: "Pending",
      bloodType: "O+",
      maxParticipants: 5
    });
    RequestParticipant.findOne.mockResolvedValue(existingParticipant);
    RequestParticipant.countDocuments.mockResolvedValue(0);

    await joinRequest(req, res);

    expect(existingParticipant.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("joinRequest should return 400 if participant limit is reached", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({
      _id: "d1",
      isProfileComplete: true,
      bloodType: "O+"
    });
    Request.findById.mockResolvedValue({
      _id: "r1",
      status: "Pending",
      bloodType: "O+",
      maxParticipants: 1
    });
    RequestParticipant.findOne.mockResolvedValue(null);
    RequestParticipant.countDocuments.mockResolvedValue(1);

    await joinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getRequestParticipants should return participant list", async () => {
    const req = { params: { id: "r1" } };
    const res = mockResponse();

    Request.findById.mockResolvedValue({
        _id: "r1",
        title: "Need O+"
    });

    RequestParticipant.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
            {
            _id: "p1",
            requestId: "r1",
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

    await getRequestParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    });
  test("updateRequestParticipantStatus should return 404 if participant not found", async () => {
    const req = {
      params: { id: "p1" },
      body: { status: "attended" }
    };
    const res = mockResponse();

    RequestParticipant.findById.mockResolvedValue(null);

    await updateRequestParticipantStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateRequestParticipantStatus should set attendedAt when status becomes attended", async () => {
    const req = {
      params: { id: "p1" },
      body: { status: "attended" }
    };
    const res = mockResponse();

    const participant = {
      _id: "p1",
      status: "joined",
      attendedAt: null,
      save: jest.fn().mockResolvedValue({
        _id: "p1",
        status: "attended",
        attendedAt: new Date()
      })
    };

    RequestParticipant.findById.mockResolvedValue(participant);

    await updateRequestParticipantStatus(req, res);

    expect(participant.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("cancelMyRequestParticipation should return 400 if status is not joined", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    Donor.findOne.mockResolvedValue({ _id: "d1" });
    RequestParticipant.findOne.mockResolvedValue({
      _id: "p1",
      status: "attended"
    });

    await cancelMyRequestParticipation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("cancelMyRequestParticipation should cancel joined participation", async () => {
    const req = { params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockResponse();

    const participant = {
      _id: "p1",
      status: "joined",
      save: jest.fn().mockResolvedValue({
        _id: "p1",
        status: "cancelled"
      })
    };

    Donor.findOne.mockResolvedValue({ _id: "d1" });
    RequestParticipant.findOne.mockResolvedValue(participant);

    await cancelMyRequestParticipation(req, res);

    expect(participant.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("addManualRequestParticipant should return 404 if donor not found", async () => {
    const req = {
        params: { id: "r1" },
        body: { donorId: "507f1f77bcf86cd799439011" }
    };
    const res = mockResponse();

    Request.findById.mockResolvedValue({
        _id: "r1",
        bloodType: "O+",
        status: "Pending",
        maxParticipants: 5
    });

    Donor.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
    });

    await addManualRequestParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    });

  

  test("addManualRequestParticipant should return 400 if donor blood type mismatches", async () => {
    const req = {
      params: { id: "r1" },
      body: { donorId: "507f1f77bcf86cd799439011" }
    };
    const res = mockResponse();

    Request.findById.mockResolvedValue({
      _id: "r1",
      bloodType: "O+",
      maxParticipants: 5
    });
    Donor.findById.mockResolvedValue({
      _id: "d1",
      bloodType: "A+",
      isProfileComplete: true
    });

    await addManualRequestParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("addManualRequestParticipant should return 400 if donor already added", async () => {
    const req = {
      params: { id: "r1" },
      body: { donorId: "507f1f77bcf86cd799439011" }
    };
    const res = mockResponse();

    Request.findById.mockResolvedValue({
      _id: "r1",
      bloodType: "O+",
      maxParticipants: 5
    });
    Donor.findById.mockResolvedValue({
      _id: "d1",
      bloodType: "O+",
      isProfileComplete: true
    });
    RequestParticipant.findOne.mockResolvedValue({
      _id: "p1",
      status: "joined"
    });

    await addManualRequestParticipant(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});