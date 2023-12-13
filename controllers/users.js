require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user");

const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_CREATED               // 201
} = require('../utils/constantsStatusCode')

function getUser(req, res, next) {

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

function getOwnUser(req, res, next) {

  return userModel
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
}

function getAllUsers(req, res, next) {

  return userModel
    .find()
    .then((users) => {
      return res.status(HTTP_STATUS_OK).send(users);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {email, password, name, about, avatar} = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => {
      userModel
      .create({
        email,
        password: hash,
        name,
        about,
        avatar
      })
      .then(({
        _id,
        email,
        name,
        about,
        avatar
      }) => {

        return res.status(HTTP_STATUS_CREATED).send({
          _id,
          email,
          name,
          about,
          avatar
        });
      })
      .catch(next)
    })
    .catch(next);
}

function login (req, res, next) {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });

      // вернём токен
      res.status(HTTP_STATUS_OK)
      .cookie('jwt', token, {
      // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true
      })
      .send({ message : "Токен успешно отправлен в куки" })
      .end()
    })
    .catch(next);
};

function updateUserData(req, res, next) {
  const userId = req.user._id;

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

