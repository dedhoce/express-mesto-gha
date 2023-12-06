const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const { NocorrectlyPswdOrEmail } = require('../utils/ErrorClass')

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false //Так по умолчанию хеш пароля пользователя не будет возвращаться из базы
    },
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто'
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Исследователь'
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
    },
  },
  {
    versionKey: false,
  }
);

UserSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {

      if (!user) {
        throw new NocorrectlyPswdOrEmail('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NocorrectlyPswdOrEmail('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model("user", UserSchema);
