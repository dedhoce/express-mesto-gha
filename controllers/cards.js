const cardModel = require("../models/card");

function getAllCards(req, res) {
  return cardModel
    .find()
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server Error" });
    });
}

function createCard(req, res) {
  req.body.owner = req.user._id;
  const cardData = req.body;

  return cardModel
    .create(cardData)
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

function deleteCard(req, res) {
  console.log(req.params);

  const { cardId } = req.params;

  return cardModel
    .findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err.name)
      console.log(err.message)
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID" });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

function likeCard(req, res) {

  const { cardId } = req.params;
  return cardModel
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID" });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

function deleteLikeCard(req, res) {

  const { cardId } = req.params;

  return cardModel
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID" });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
