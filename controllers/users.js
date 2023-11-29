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

  const userId = req.user._id;
  console.log(userId)
  return userModel
    .findByIdAndUpdate(userId, req.body, {
      runValidators: true,
      returnDocument: 'after'
    })
    .orFail()
    .then((user) => {
      console.log('then')
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      //console.log(err.message)
      typeError(err, res)
    })
}

function updatingInfoDecorator(func) {
  return function(req, res) {
    let { name, about } = req.body
    if (name || about) {
      req.body = { name, about }
      return func(req, res)
    } else {
      req.body = {name : '', about: ''}
      return func(req, res)
    }
  }
}

function updatingAvatarDecorator(func) {
  return function(req, res) {
    let { avatar } = req.body
    if (avatar) {
      req.body = { avatar }
      return func(req, res)
    } else {
      req.body = {avatar: ''}
      return func(req, res)
    }
  }
}

const updateInfo = updatingInfoDecorator(updateUserData)
const updateAvatar = updatingAvatarDecorator(updateUserData)

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateInfo,
  updateAvatar
};

