const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000, BASE_PATH } = process.env;
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("Connect Mongo");
});

app.get('/', function (req, res) {
  res.status(200).send('Express GET');
});

app.use((req, res, next) => {
  req.user = {
    _id: '655cad73c2ff301cc06ac965' // _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use('/:linkIsNot', (req, res) => {
  const {linkIsNot} = req.params
  if (linkIsNot !== "users" || linkIsNot !== "cards") {
    res.status(404).send(`По адресу http://localhost:3000/${linkIsNot} и запросу ${req.method} ничего нет`)
  }
})


app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
});
