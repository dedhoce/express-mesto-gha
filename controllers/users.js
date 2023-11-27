const userModel = require("../models/user");
const { typeError } = require("../utils/errors")
const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_CREATED               // 201
} = require('../utils/constantsError')

function getUser(req, res) {
  console.log(req.params);

  const { userId } = req.params;
  console.log(userId)
  return userModel
    .findById(userId)
    .orFail()
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      typeError(err, res)
    });
}

function getAllUsers(req, res) {
  return userModel
    .find()
    .then((users) => {
      return res.status(HTTP_STATUS_OK).send(users);
    })
    .catch((err) => {
      typeError(err, res)
    });
}

function createUser(req, res) {
  const userData = req.body;
  console.log(userData);

  return userModel
    .create(userData)
    .then((user) => {
      return res.status(HTTP_STATUS_CREATED).send(user);
    })
    .catch((err) => {
      typeError(err, res)
    });
}

function updateUserData(req, res) {
  const { userId } = req.params;
  return userModel
    .findByIdAndUpdate(userId, req,body, {
      returnDocument: after,
      runValidators: true
    })
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user)
    })
    .catch((err) => {
      typeError(err, res)
    });
}


function updateUserInfo(req, res) {

  updateUserData(req, res)
}

function updateUserAvatar(req, res) {

  updateUserData(req, res)
}

module.exports = {
  createUser,
  getAllUsers,
  updateUserInfo,
  updateUserAvatar,
  getUser
};
