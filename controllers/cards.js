const cardModel = require("../models/card");
const mongoose = require("mongoose");

const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_CREATED             // 201
} = require('../utils/constantsStatusCode')

const { AlienCard } = require('../utils/ErrorClass')

function getAllCards(req, res, next) {
  return cardModel
    .find()
    .then((cards) => {
      return res.status(HTTP_STATUS_OK).send(cards);
    })
    .catch(next);
}

function createCard(req, res, next) {
  req.body.owner = req.user._id;
  const cardData = req.body;

  return cardModel
    .create(cardData)
    .then((card) => {
      return res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  return cardModel
    .findById(cardId)
    .orFail()
    .then((card) => {
      try {
        if(card.owner.valueOf() === req.user._id) {
          return cardModel
            .deleteOne({ _id: cardId })
            .then((card) => {
              return res.status(HTTP_STATUS_OK).send(card);
            })
            .catch(next);
        }
        throw new AlienCard('Можно удалять только свои карточки!')
      } catch (err) {
        next(err)
      }
    })
    .catch(next)
}

function toggleLikeCard(req, res, methodObj, next) {
  const { cardId } = req.params;

  return cardModel
    .findByIdAndUpdate(
      cardId,
      methodObj, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail()
    .then((card) => {
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch(next);
}

function togglelikeCardDecorator(func) {

  return function(req, res, next) {
    if (req.method === 'PUT') {
      return func(req, res, { $addToSet: { likes: req.user._id } }, next) // добавить _id в массив, если его там нет
    }
    if (req.method === 'DELETE') {
      return func(req, res, { $pull: { likes: req.user._id } }, next)   // убрать _id из массива
    }
  }
}

const likeCard = togglelikeCardDecorator(toggleLikeCard)
const deleteLikeCard = togglelikeCardDecorator(toggleLikeCard)


module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
