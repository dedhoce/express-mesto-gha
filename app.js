const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsValidator = require('./middlewares/handleErrors')
const { errors } = require('celebrate');
const cors = require('./middlewares/cors')

const { PORT = 3000, BASE_PATH } = process.env;

const appRouter = require('./routes/index')



const app = express();

app.use(cors) // подключаем проверку CORS как мидлвэр

app.use(express.json());  // подключаем парсер json как мидлвэр
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("Connect Mongo");
});

app.use(requestLogger)

app.use(appRouter);

app.use(errorLogger)

app.use(errors())

app.use(errorsValidator)

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
});

