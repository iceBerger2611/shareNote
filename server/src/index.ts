import express from "express";

const app = express();

app.get("/", (req, res) => {
  const date = new Date();
  const format = `res sent at ${date.getDay()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log(format);
  res.send(format);
});

app.listen(3000, () => {
  console.log(`listening on port 3000`);
});
