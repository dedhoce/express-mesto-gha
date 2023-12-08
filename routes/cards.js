const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllCards, createCard, deleteCard, likeCard, deleteLikeCard } = require("../controllers/cards");

function validateCardIdJoi () {
  return celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    })
  })
}

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^[www.]*https{0,1}\:\/\/[\w\b-._~:\/?#[\]@!\$&\'\(\)\*\+,;=]+$/)
  }).unknown(true)
}), createCard);
router.get('/', getAllCards);
router.delete('/:cardId', validateCardIdJoi(), deleteCard);
router.put('/:cardId/likes', validateCardIdJoi(), likeCard);
router.delete('/:cardId/likes', validateCardIdJoi(), deleteLikeCard);

module.exports = router;
