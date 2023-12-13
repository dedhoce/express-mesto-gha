const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users')
const { celebrate, Joi } = require('celebrate');

const {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_NOT_FOUND            // 404
} = require('../utils/constantsStatusCode')

router.get('/', function (req, res) {
  res.status(HTTP_STATUS_OK).send('Express GET');
});

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().min(8).pattern(new RegExp(/^[a-zA-Z0-9\_]{8,30}$/))
  })
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().min(8).pattern(new RegExp(/^[a-zA-Z0-9\_]{8,30}$/)),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(/^[www.]*https{0,1}\:\/\/[\w\b-._~:\/?#[\]@!\$&\'\(\)\*\+,;=]+$/))
  }).unknown(true)
}), createUser);

router.use('/users', auth, usersRouter);

router.use('/cards', auth, cardsRouter);

router.use('/:linkIsNot', (req, res) => {
  const {linkIsNot} = req.params
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: `По адресу http://localhost:3000/${linkIsNot} и запросу ${req.method} ничего нет`})
})

module.exports = router