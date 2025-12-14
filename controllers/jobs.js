const JobSchema = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await JobSchema.find({ createdBy: req.user.userId }).sort("createdBy");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await JobSchema.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No jobs with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await JobSchema.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Company and position fields can't be empty");
  }

  const job = await JobSchema.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new NotFoundError(`No jobs with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await JobSchema.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No jobs with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
