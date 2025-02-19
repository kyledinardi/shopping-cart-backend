require('dotenv').config();
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.listen(PORT, () =>
  console.log(`My first Express app - listening on port ${PORT}!`),
);
