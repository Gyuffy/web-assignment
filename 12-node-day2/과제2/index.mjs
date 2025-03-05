import express from "express";
import morgan from "morgan";
import http from "http";

const app = express();
const PORT = 8000;

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/v1/gugu/:num1/:num2/:result", (req, res) => {
  try {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);
    const result = Number(req.params.result);
    if (num1 < 2 || num1 > 9 || num2 < 2 || num2 > 9) {
      return res.status(400).json({
        error: "구구단은 2 부터 9 까지입니다.",
      });
    } else if (num1 * num2 === result) {
      return res.json({
        message: "정답입니다!",
      });
    } else if (num1 * num2 !== result) {
      return res.json({
        message: `틀렸습니다! 정답은 ${num1 * num2} 입니다.`,
      });
    }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
});

const members = [
  {
    id: "david123",
    username: "데이비드",
    phone_number: "010-1234-5678",
  },
  {
    id: "nana777",
    username: "나나",
    phone_number: "010-6666-7777",
  },
  {
    id: "jinsu454",
    username: "박진수",
    phone_number: "010-1212-1212",
  },
];

app.get("/api/v1/members", (req, res) => {
  try {
    return res.json({
      members: members,
    });
  } catch (error) {
    return res.json({
      error: error,
    });
  }
});

app.get("/api/v1/members/:member_id", (req, res) => {
  try {
    const member_id = req.params.member_id;
    const member = members.filter((members) => members.id === member_id);
    if (member.length === 0) {
      return res.status(404).json({
        error: "아이디에 해당하는 사용자를 찾을 수 없습니다.",
      });
    } else {
      return res.json({
        member: member[0],
      });
    }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`This server listening on ${PORT}`));
