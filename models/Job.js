const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please, provide a company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please, provide a position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please, provide a user bounded to this job"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
