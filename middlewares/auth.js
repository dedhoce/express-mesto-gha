const jwt = require('jsonwebtoken');

const { NeedAuthorized } = require('../utils/ErrorClass')

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  try  {
    if (!authorization) {
      throw new NeedAuthorized('Необходима авторизация')
    }
  } catch (err) {
    return next(err)
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(err)
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальшe
};