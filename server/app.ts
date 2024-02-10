import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 1234;

const littleJson = {
  emotes: {
    buh: "buh",
    guh: "guh",
  },
  data: "11111",
};

app.get("/api", (_, res) => {
  res.send(littleJson);
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT} port`);
  console.log(process.env.BUH);
});
