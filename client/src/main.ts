import "./style.css";

fetch("/api")
  .then((res) => res.json())
  .then((data) => console.log(data));
