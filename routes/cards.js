const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllCards, createCard, deleteCard, likeCard, deleteLikeCard } = require("../controllers/cards");

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^[www.]*https*\:\/\/|\w+|\w+|\W+|$/)
  }).unknown(true)
}), createCard);
router.get('/', getAllCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;
