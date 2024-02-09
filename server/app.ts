import "dotenv/config";
import express from "express";

const app = express();
const PORT = 1234;

app.get('/', (_, res) => {
	res.send("demo");
})

app.listen(PORT, () => {
	console.log(`server running on ${PORT} port`);
	console.log(process.env.BUH);
})

