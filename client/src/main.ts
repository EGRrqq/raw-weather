import "./style.css";

const link = import.meta.env.DEV
  ? "/api/weather"
  : import.meta.env.VITE_SERVER + "/api/weather";

fetch(link)
  .then((res) => res.json())
  .then((data) => console.log(data));
