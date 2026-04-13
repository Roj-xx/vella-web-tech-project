const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: function () {
        return !this.userId;
      },
      default: ""
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    isRegisteredUser: {
      type: Boolean,
      default: true
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
      default: "unknown"
    },
    address: {
      type: String,
      default: ""
    },
    contactNumber: {
      type: String,
      default: ""
    },
    lastDonationDate: {
      type: Date,
      default: null
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// unique userId only when userId exists
donorSchema.index(
  { userId: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $type: "objectId" } }
  }
);

module.exports = mongoose.model("Donor", donorSchema);