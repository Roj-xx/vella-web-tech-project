const mongoose = require("mongoose");

const donationDriveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    location: {
      type: String,
      required: [true, "Location is required"]
    },
    date: {
      type: String,
      required: [true, "Date is required"]
    },
    time: {
      type: String,
      required: [true, "Time is required"]
    },
    description: {
      type: String,
      default: ""
    },
    maxParticipants: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming"
    },
    imageURL: {
      type: String,
      default: ""
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

module.exports = mongoose.model("DonationDrive", donationDriveSchema);