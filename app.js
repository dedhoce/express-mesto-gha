const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000, BASE_PATH } = process.env;

const appRouter = require('./routes/index')

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("Connect Mongo");
});

app.use((req, res, next) => {
  req.user = {
    _id: '655cad4ac2ff301cc06ac963' // _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(appRouter);

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
});

