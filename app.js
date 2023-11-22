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
    _id: '655cb2dadb577a89a18b7b4c' // _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter)


app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
});
