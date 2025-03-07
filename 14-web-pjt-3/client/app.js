const ctx1 = document.getElementById("velocityChart");
const ctx2 = document.getElementById("bulletChart");
const ctx3 = document.getElementById("angleChart");

const SERVER_URL = "http://localhost:8000/api/v1";

let turretAngle = 0;

function makeVelocity(seconds, velocities) {
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: seconds,
      datasets: [
        {
          label: "전차 속도 ( km / hour )",
          data: velocities,
          fill: true,
          borderColor: "#36A2EB",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: false,
      y: {
        stacked: true,
      },
    },
  });
}

async function getVelocities() {
  try {
    const response = await axios.get(`${SERVER_URL}/velocities`);
    if (response.status === 200) {
      const seconds = response.data.map((value) => value.seconds);
      const velocities = response.data.map((velocity) => velocity.velocity);
      makeVelocity(seconds, velocities);
    }
  } catch (error) {
    console.error(error);
  }
}

function makeBullet(types, amounts) {
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: types,
      datasets: [
        {
          label: "남은 탄환 (발)",
          data: amounts,
          backgroundColor: ["#36A2EB", "#FF6384", "#4BC0C0"],
          borderColor: "#36A2EB",
        },
      ],
    },
    options: {
      responsive: false,
    },
  });
}

async function getBullets() {
  try {
    const response = await axios.get(`${SERVER_URL}/bullets`);
    if (response.status === 200) {
      const types = response.data.map((bullet) => bullet.type);
      const amounts = response.data.map((bullet) => bullet.amount);
      makeBullet(types, amounts);
    }
  } catch (error) {
    console.error(error);
  }
}

function makeAngle() {
  new Chart(ctx3, {
    type: "doughnut",
    data: {
      labels: ["각도", ""],
      datasets: [
        {
          label: "포탑의 각도(도)",
          data: [turretAngle, 360 - turretAngle],
          backgroundColor: ["#36A2EB", "#C9CBCF"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: false,
    },
  });
}

async function getAngles() {
  try {
    const response = await axios.get(`${SERVER_URL}/angle_infos`);
    if (response.status === 200) {
      turretAngle = response.data;
      makeAngle();
    }
  } catch (error) {
    console.error(error);
  }
}

getVelocities();
getBullets();
getAngles();
