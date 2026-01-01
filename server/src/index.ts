import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const date = new Date();
  const format = `res sent at ${date.getDay()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log(format);
  res.send(format);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
