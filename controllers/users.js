const userModel = require("../models/user");

function getUser(req, res) {
  console.log(req.params);

  const { userId } = req.params;
  console.log(userId)
  return userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID" });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

function getAllUsers(req, res) {
  return userModel
    .find()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server Error" });
    });
}

function createUser(req, res) {
  const userData = req.body;
  console.log(userData);

  return userModel
    .create(userData)
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

function updateUserInfo(req, res) {
  const userInfo = req.body;

  return userModel
    .findByIdAndUpdate(req.user._id, userInfo, { runValidators: true })
    .then((user) => {
      userModel.findById(req.user._id).then((userUpdate) => {
        res.send(userUpdate)
      })
      return res.status(200);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

function updateUserAvatar(req, res) {
  const userAvatar = req.body;
  console.log(req.user._id);

  return userModel
    .findByIdAndUpdate(req.user._id, userAvatar)
    .then((user) => {
      userModel.findById(req.user._id).then((userUpdate) => {
        res.send(userUpdate)
      })
      return res.status(200);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

module.exports = {
  createUser,
  getAllUsers,
  updateUserInfo,
  updateUserAvatar,
  getUser,
};
