const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_NOT_FOUND            // 404
} = require('../utils/constantsStatusCode')

router.get('/', function (req, res) {
  res.status(HTTP_STATUS_OK).send('Express GET');
});

router.use('/users', usersRouter);

router.use('/cards', cardsRouter);

router.use('/:linkIsNot', (req, res) => {
  const {linkIsNot} = req.params
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: `По адресу http://localhost:3000/${linkIsNot} и запросу ${req.method} ничего нет`})
})

module.exports = router