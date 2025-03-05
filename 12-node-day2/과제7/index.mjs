import express from "express";
import morgan from "morgan";
import http from "http";

const app = express();
const PORT = 8000;

app.use(morgan("dev"));
app.use(express.json());

let lastIdx = 3;

const todos = [
  {
    id: 1,
    title: "밥먹기",
    isComplete: false,
  },
  {
    id: 2,
    title: "영화보기",
    isComplete: true,
  },
  {
    id: 3,
    title: "게임하기",
    isComplete: false,
  },
];

app.get("/api/v1/todos", (req, res) => {
  try {
    return res.json({
      todos: todos,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.get("/api/v1/todos/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const todo = todos.filter((todos) => todos.id === id);
    if (todo.length === 0) {
      return res.status(404).json({
        todo: "해당 아이디에 해당하는 목록이 없습니다.",
      });
    } else {
      return res.json({
        todo: todo[0],
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.post("/api/v1/todos", (req, res) => {
  try {
    const title = req.body.title;
    const isComplete = req.body.isComplete;

    // title이 undefined인 경우 !title은 true를 반환
    // trim()은 문자열에서 공백을 제거
    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "title 을 입력해야 합니다.",
      });
    }

    if (typeof isComplete !== "boolean") {
      return res.status(400).json({
        error: "isComplete 값은 true 또는 false 여야 합니다.",
      });
    }

    lastIdx++;

    todos.push({
      id: lastIdx,
      title: title,
      isComplete: isComplete,
    });

    return res.status(201).json({
      message: "목록을 추가했습니다.",
      todos: todos,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.patch("/api/v1/todos/:id", (req, res) => {
  try {
    const title = req.body.title;
    const isComplete = req.body.isComplete;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "title 입력 바람",
      });
    }

    if (typeof isComplete !== "boolean") {
      return res.status(400).json({
        error: "isComplete 값은 true 또는 false 여야 합니다.",
      });
    }

    const tar = todos.filter((target) => target.id === Number(req.params.id));
    if (tar.length === 0) {
      return res.status(404).json({
        error: "수정할 목록이 존재하지 않습니다.",
      });
    }

    const todo = tar[0];

    todo.title = title;
    todo.isComplete = isComplete;

    return res.status(201).json({
      result: `${req.params.id}번 목록 수정 완`,
      todo: todo,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.delete("/api/v1/todos/:id", (req, res) => {
  try {
    const tar = todos.filter((todo) => todo.id === Number(req.params.id));
    if (tar.length === 0) {
      return res.status(404).json({
        error: "삭제할 목록이 존재하지 않습니다.",
      });
    }
    const newTodos = todos.filter((todo) => todo.id !== Number(req.params.id));
    todos.length = 0;
    todos.push(...newTodos);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`This server listening on ${PORT}`));
