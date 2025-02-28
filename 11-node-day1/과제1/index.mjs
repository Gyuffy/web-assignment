import express from "express";
import morgan from "morgan";
import http from "http";

const app = express();
const PORT = 8000;

const userData = {
  name: "david",
  age: 30,
  skills: {
    client: ["vue.js"],
    server: ["django", "express"],
  },
};

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/v1/get-express", (req, res) => {
  try {
    return res.json({
      result: userData.skills.server[1],
    });
  } catch (error) {
    return res.json({
      error: error,
    });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`This server listening on ${PORT}`));
