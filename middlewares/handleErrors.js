const mongoose = require("mongoose");

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
  if (err instanceof mongoose.Error.CastError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({message : "Invalid ID"});
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message : err.message });
  }
  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(HTTP_STATUS_NOT_FOUND).send({ message : "Document not found" });
  }
  if (err.name === 'Необходима авторизация') {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message : 'Необходима авторизация' });
  }
  if (err.name === 'Неправильные почта или пароль') {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message : 'Неправильные почта или пароль' });
  }
  if (err.name === 'Чужая карточка!') {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message : 'Можно удалять только свои карточки!' })
  }
  if (err.code === 11000) {
    return res.status(HTTP_STATUS_CONFLICT).send({ message : 'Пользователь с данным email уже существует' })
  }
  serverError(res)
}

