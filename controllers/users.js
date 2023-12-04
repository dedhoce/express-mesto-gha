const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user");
const { typeError } = require("../middlewares/handleErrors")
const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_CREATED               // 201
} = require('../utils/constantsStatusCode')

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
    .catch(next);
}

function getOwnUser(req, res) {
  console.log(req.user._id);

  const { userId } = req.user._id;
  console.log(userId)
  return userModel
    .findById(userId)
    .select('+password')
    .orFail()
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
}

function getAllUsers(req, res) {
  return userModel
    .find()
    .then((users) => {
      return res.status(HTTP_STATUS_OK).send(users);
    })
    .catch(next);
}

function createUser(req, res) {
  const {email, password} = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        email,
        password: hash
      })
    })
    .then((user) => {
      return res.status(HTTP_STATUS_CREATED).send(user);
    })
    .catch(next);
}

function login (req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' });

      // вернём токен
      res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch(next);
};

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
    .catch(next)
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
  login,
  getAllUsers,
  getUser,
  getOwnUser,
  updateInfo,
  updateAvatar
};

