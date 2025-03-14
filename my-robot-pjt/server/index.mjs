import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import pool from "./db/index.mjs";

const app = express();
const PORT = 8000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get("/api/v1/command-logs", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM command_log");
    return res.json(data[0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/v1/command-logs/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `SELECT * FROM command_log WHERE id = ${req.params.id}`
    );
    return res.json(data[0][0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/v1/command-logs/last/get", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM command_log ORDER BY id DESC LIMIT 1"
    );
    return res.json(data[0][0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/api/v1/command-logs", async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO command_log (
          program,
          conveyer_speed,
          joint1,
          joint2,
          joint3,
          joint4,
          location_x,
          location_y,
          location_z,
          obj_detection_result,
          temp_result,
          ultrasonic_result,
          infrared_result,
          pressure_result,
          light_result
        ) VALUES (
          '${req.body.program}',
          '${req.body.conveyer_speed}',
          '${req.body.joint1}',
          '${req.body.joint2}',
          '${req.body.joint3}',
          '${req.body.joint4}',
          '${req.body.location_x}',
          '${req.body.location_y}',
          '${req.body.location_z}',
          '${req.body.obj_detection_result}',
          '${req.body.temp_result}',
          '${req.body.ultrasonic_result}',
          '${req.body.infrared_result}',
          '${req.body.pressure_result}',
          '${req.body.light_result}'
        )`
    );
    const data = await pool.query(
      "SELECT * FROM command_log ORDER BY id DESC LIMIT 1"
    );
    return res.status(201).json(data[0][0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`This server is listening on ${PORT}`));
