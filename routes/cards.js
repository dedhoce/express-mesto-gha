const router = require('express').Router();
const { getAllCards, createCard, deleteCard, likeCard, deleteLikeCard } = require("../controllers/cards");

router.post('/', createCard);
router.get('/', getAllCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLikeCard);


module.exports = router;
