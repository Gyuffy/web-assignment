import express from "express";
import morgan from "morgan";
import http from "http";

const app = express();
const PORT = 8000;

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/v1/calc/:command/:num1/:num2", (req, res) => {
  try {
    const command = req.params.command;
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);
    let result;
    if (command === "add") {
      result = num1 + num2;
    } else if (command === "subtract") {
      result = num1 - num2;
    } else if (command === "multiply") {
      result = num1 * num2;
    } else if (command === "divide") {
      if (num2 === 0) {
        return res.status(400).json({
          error: "0으로 나누기는 불가능합니다.",
        });
      }
      result = num1 / num2;
    } else {
      return res.status(400).json({
        error: "사용법을 다시 참고하세요.",
      });
    }
    return res.json({
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`This server listening on ${PORT}`));
