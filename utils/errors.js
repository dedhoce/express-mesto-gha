const mongoose = require("mongoose");

const {
  HTTP_STATUS_BAD_REQUEST,          // 400
  HTTP_STATUS_NOT_FOUND,            // 404
  HTTP_STATUS_INTERNAL_SERVER_ERROR // 500
} = require('./constantsError')

const serverError = (res) => {
  return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Server Error" })
}

const typeError = (err, res) => {
  console.log(err)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({message : "Invalid ID"});
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message : err.message });
  }
  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(HTTP_STATUS_NOT_FOUND).send({ message : "Document not found" });
  }
  serverError(res)
}

module.exports = {
  serverError,
  typeError
}