import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

const littleJson = {
  emotes: {
    buh: "buh",
    guh: "guh",
  },
  data: "11111",
};

app.use(morgan('dev'));
app.use(cors());

app.get("/api", (_, res) => {
  res.send(littleJson);
});

export default app;
