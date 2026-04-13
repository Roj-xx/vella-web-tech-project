const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "Blood type is required"]
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Urgency is required"]
    },
    status: {
      type: String,
      enum: ["Pending", "Fulfilled"],
      default: "Pending"
    },
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    description: {
      type: String,
      default: ""
    },
    maxParticipants: {
      type: Number,
      default: 0
    },
    venue: {
      type: String,
      required: [true, "Venue is required"]
    },
    date: {
      type: String,
      required: [true, "Date is required"]
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Request", requestSchema);