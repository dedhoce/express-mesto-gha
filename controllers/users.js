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
  return userModel
    .findByIdAndUpdate(userId, req.body, {
      runValidators: true,
      returnDocument: 'after'
    })
    .orFail()
}

function cachingDecorator(func) {
  let cache = new Map()

  return function(req, res) {
    //let {name, about, avatar} = req.body
    //console.log(cache)
    if (cache.has(res)) {   // если кеш содержит такой ключ,
      console.log(1)

      return cache.get(res)  // читаем из него результат
        .clone()
        .then((user) => {
          return res.status(HTTP_STATUS_OK).send(user)
        })
        .catch((err) => {
          console.log(err.message)
          typeError(err, res)
        })
    }
    console.log(2)
    let result = func(req, res)   // иначе, вызываем функцию,

    cache.set(res, result); // и кешируем (запоминаем) результат
    return result
      .then((user) => res.status(HTTP_STATUS_OK).send(user))
      .catch((err) => {
        typeError(err, res)
      });
  }
}

updateUserData = cachingDecorator(updateUserData)

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUserData
};

