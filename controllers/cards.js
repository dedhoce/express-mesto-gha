const cardModel = require("../models/card");
const { serverError, typeError } = require("../utils/errors")

const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_CREATED               // 201
} = require('../utils/constantsError')

function getAllCards(req, res) {
  return cardModel
    .find()
    .orFail()
    .then((cards) => {
      return res.status(HTTP_STATUS_OK).send(cards);
    })
    .catch((err) => {
      serverError(res)
    });
}

function createCard(req, res) {
  req.body.owner = req.user._id;
  const cardData = req.body;

  return cardModel
    .create(cardData)
    .then((card) => {
      return res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      typeError(err, res)
    });
}

function deleteCard(req, res) {
  console.log(req.params);

  const { cardId } = req.params;

  return cardModel
    .findByIdAndDelete(cardId)
    .orFail()
    .then((card) => {
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      typeError(err, res)
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
    .orFail()
    .then((card) => {
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      typeError(err, res)
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
    .orFail()
    .then((card) => {
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      typeError(err, res)
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
