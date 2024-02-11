import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createLink } from "./helpers";

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.get("/api/weather", async (_, res) => {
  const weatherLink = createLink({
    api_key: process.env.API_KEY as string,
    base_link: process.env.BASE_LINK as string,
    route: "insight_weather",
    other_keys: ["feedtype=json", "ver=1.0"],
  });

  const data = await fetch(weatherLink).then((res) => res.json());

  res.send(data);
});

export default app;
