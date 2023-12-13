const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const { getAllUsers, getUser, getOwnUser, updateInfo, updateAvatar } = require("../controllers/users");

router.get("/", getAllUsers);

router.get("/me", getOwnUser);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  }).unknown(true)
}), updateInfo);

router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(/^[www.]*https{0,1}\:\/\/[\w\b-._~:\/?#[\]@!\$&\'\(\)\*\+,;=]+$/))
  })
}), updateAvatar);

router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  })
}), getUser);

module.exports = router;
