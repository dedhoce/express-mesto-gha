const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const { PORT = 3000, BASE_PATH } = process.env;

const appRouter = require('./routes/index')

const errorsValidator = require('./middlewares/handleErrors')
const { errors } = require('celebrate');

const app = express();

app.use(express.json());
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("Connect Mongo");
});

app.use(appRouter);

app.use(errors())

app.use(errorsValidator)

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
});

