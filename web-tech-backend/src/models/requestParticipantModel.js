const mongoose = require("mongoose");

const requestParticipantSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
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
    },
  },
  {
    timestamps: true
  }
);

// prevent duplicate joins
requestParticipantSchema.index({ requestId: 1, donorId: 1 }, { unique: true });

module.exports = mongoose.model("RequestParticipant", requestParticipantSchema);