import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";

const velocities = [
  { seconds: 1, velocity: 0 },
  { seconds: 2, velocity: 8 },
  { seconds: 3, velocity: 11 },
  { seconds: 4, velocity: 13 },
  { seconds: 5, velocity: 16 },
  { seconds: 6, velocity: 16 },
  { seconds: 7, velocity: 15 },
  { seconds: 8, velocity: 12 },
  { seconds: 9, velocity: 13 },
  { seconds: 10, velocity: 19 },
  { seconds: 11, velocity: 21 },
  { seconds: 12, velocity: 23 },
  { seconds: 13, velocity: 24 },
  { seconds: 14, velocity: 22 },
  { seconds: 15, velocity: 21 },
  { seconds: 16, velocity: 22 },
  { seconds: 17, velocity: 25 },
  { seconds: 18, velocity: 23 },
  { seconds: 19, velocity: 19 },
  { seconds: 20, velocity: 17 },
];

const bullets = [
  { type: "철갑탄", amount: 12 },
  { type: "고폭탄", amount: 8 },
  { type: "성형작약", amount: 4 },
];

const turretAngle = 20;

const PORT = 8000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get("/api/v1/velocities", (req, res) => {
  try {
    return res.json(velocities);
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

app.get("/api/v1/bullets", (req, res) => {
  try {
    return res.json(bullets);
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

app.get("/api/v1/angle_infos", (req, res) => {
  try {
    return res.json(turretAngle);
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => `This server is listening on ${PORT}`);
