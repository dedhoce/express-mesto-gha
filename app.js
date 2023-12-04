const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000, BASE_PATH } = process.env;

const appRouter = require('./routes/index')
const { createUser, login } = require('./controllers/users')

const auth = require('./middlewares/auth')
const errorsValidator = require('./middlewares/handleErrors')
const { errors } = require('celebrate');

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("Connect Mongo");
});

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth)

app.use(appRouter);

app.use(errors())

app.use(errorsValidator)

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
});

