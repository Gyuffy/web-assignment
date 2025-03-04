import express from "express";
import morgan from "morgan";
import http from "http";

// 접속정보 가져오기
import pool from "./db/index.mjs";

const app = express();
const PORT = 8000;

app.use(morgan("dev"));

app.use(express.json());

app.get("/api/v1/todos", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM todos");
    return res.json(data[0]);
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.get("/api/v1/todos/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `SELECT * FROM todos WHERE id = ${req.params.id}`
    );
    if (data[0][0] === undefined) {
      return res.status(404).json({
        error: "아이디에 해당하는 할 일이 존재하지 않습니다.",
      });
    }
    return res.json(data[0][0]);
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.post("/api/v1/todos", async (req, res) => {
  try {
    const title = req.body.title;
    const is_complete = req.body.is_complete;
    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "할 일을 입력하세요"
      })
    }
    if (is_complete === undefined || typeof is_complete !== "boolean") {
      return res.status(400).json({
        error: "완료 여부를 boolean 으로 제공하세요"
      })
    }
    await pool.query(
      `INSERT INTO todos (
        title,
        is_complete
      ) VALUES (
        '${title.trim()}',
        ${is_complete}
      )`
    );
    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.patch("/api/v1/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const is_complete = req.body.is_complete;
    const data = await pool.query(`SELECT * FROM todos WHERE id = ${id}`);
    if (!data[0][0]) {
      return res.status(404).json({
        error: "아이디에 해당하는 할 일이 존재하지 않습니다."
      })
    }
    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "할 일을 입력하세요"
      })
    }
    if (is_complete === undefined || typeof is_complete !== "boolean") {
      return res.status(400).json({
        error: "완료 여부를 boolean 으로 제공하세요"
      })
    }
    await pool.query(
      `UPDATE todos
        SET title = '${title.trim()}',
        is_complete = ${is_complete}
        WHERE id = ${id}
      `
    );
    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.delete("/api/v1/todos/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM todos WHERE id = ${req.params.id}`);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`This server listening on ${PORT}`));
