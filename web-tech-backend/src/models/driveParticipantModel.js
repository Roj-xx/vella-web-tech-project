const mongoose = require("mongoose");

const driveParticipantSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationDrive",
      required: true
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true
    },
    status: {
      type: String,
      enum: ["joined", "attended", "missed", "cancelled"],
      default: "joined"
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attendedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

driveParticipantSchema.index({ driveId: 1, donorId: 1 }, { unique: true });

module.exports = mongoose.model("DriveParticipant", driveParticipantSchema);