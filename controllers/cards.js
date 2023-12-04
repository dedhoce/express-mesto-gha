const cardModel = require("../models/card");
const { serverError, typeError } = require("../middlewares/handleErrors")

const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_CREATED,             // 201
  HTTP_STATUS_BAD_REQUEST           // 400
} = require('../utils/constantsStatusCode')

function getAllCards(req, res) {
  return cardModel
    .find()
    .then((cards) => {
      return res.status(HTTP_STATUS_OK).send(cards);
    })
    .catch(next);
}

function createCard(req, res) {
  req.body.owner = req.user._id;
  const cardData = req.body;

  return cardModel
    .create(cardData)
    .then((card) => {
      return res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch(next);
}

function deleteCard(req, res) {
  console.log(req.params);

  const { cardId } = req.params;
  try {
    if(cardId === req.user._id) {
      return cardModel
        .findByIdAndDelete(cardId)
        .orFail()
        .then((card) => {
          return res.status(HTTP_STATUS_OK).send(card);
        })
        .catch(next);
    }
    return Promise.reject(new Error('Чужая карточка!'))
  } catch (err) {
    next(err)
  }
}

function toggleLikeCard(req, res, methodObj) {
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
  return function(req, res) {
    if (req.method === 'put') {
      return func(req, res, { $addToSet: { likes: req.user._id } }) // добавить _id в массив, если его там нет
    }
    if (req.method === 'delete') {
      return func(req, res, { $pull: { likes: req.user._id } })   // убрать _id из массива
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
