const mongoose = require("mongoose");
const {
  AlienCard,
  NeedAuthorized,
  NocorrectlyPswdOrEmail
} = require('../utils/ErrorClass')

const {
  HTTP_STATUS_BAD_REQUEST,          // 400
  HTTP_STATUS_UNAUTHORIZED,         // 401
  HTTP_STATUS_NOT_FOUND,            // 404
  HTTP_STATUS_CONFLICT,             // 409
  HTTP_STATUS_INTERNAL_SERVER_ERROR // 500
} = require('../utils/constantsStatusCode')

const serverError = (res) => {
  return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Server Error" })
}

module.exports = (err, req, res, next) => {
  //console.log(err)

  if (err instanceof mongoose.Error.CastError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({message : "Invalid ID"});
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message : err.message });
  }
  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(HTTP_STATUS_NOT_FOUND).send({ message : "Document not found" });
  }
  if (err instanceof NeedAuthorized) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message : err.message });
  }
  if (err instanceof NocorrectlyPswdOrEmail) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message : err.message });
  }
  if (err instanceof AlienCard) {
    return res.status(err.statusCode).send({ message : err.message })
  }
  if (err.code === 11000) {
    return res.status(HTTP_STATUS_CONFLICT).send({ message : 'Пользователь с данным email уже существует' })
  }
  serverError(res)

}

