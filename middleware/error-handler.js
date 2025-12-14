const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  let customError = {
    statusCode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Please, try again later.",
  };

  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }
  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.msg = `No item found with id: ${err.value}`;
  }
  if (err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please, provide another value`;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
