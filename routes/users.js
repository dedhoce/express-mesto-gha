const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const {createUser, getAllUsers, getUser, getOwnUser, updateInfo, updateAvatar} = require("../controllers/users");

router.post("/", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
  })
}), createUser);
router.get("/", getAllUsers);
router.get("/me", getOwnUser)
router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  }).unknown(true)
}), updateInfo);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().pattern(/^[www.]*https*\:\/\/|\w+|\w+|\W+|$/)
  })
}), updateAvatar);
router.get("/:userId", getUser);

module.exports = router;
