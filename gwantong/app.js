let speed = 0;
let ammo = 10;
let fuel = 100; // 연료 초기 값
let angle = 0; // 탱크의 회전 각도
let gunAngle = 0; // 포신 각도

const tank = document.getElementById('tank');
const speedDisplay = document.getElementById('speed');
const ammoDisplay = document.getElementById('ammo');
const fuelGauge = document.getElementById('fuel-gauge');
const gun = document.getElementById('gun');
const gunAngleSlider = document.getElementById('gunAngleSlider');
const gunAngleDisplay = document.getElementById('gunAngleDisplay');

// 탱크의 속도를 변경하는 함수
function updateSpeed(newSpeed) {
    speed = newSpeed;
    speedDisplay.textContent = speed;
}

// 탱크의 탄환 수를 변경하는 함수
function updateAmmo() {
    ammo--;
    ammoDisplay.textContent = ammo;
}

// 연료를 감소시키는 함수
function updateFuel() {
    fuel -= 2; // 연료가 움직일 때마다 2씩 감소 (단위: %)
    if (fuel < 0) fuel = 0;
    fuelGauge.style.width = fuel + '%';
}

// 탱크를 전진시키는 함수
function moveForward() {
    if (fuel > 0 && ammo > 0) {
        updateSpeed(speed + 10);
        updateAmmo();
        updateFuel(); // 연료 감소
        tank.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    } else {
        if (ammo === 0) alert('탄환이 없습니다!');
        if (fuel === 0) alert('연료가 부족합니다!');
    }
}

// 탱크를 후진시키는 함수
function moveBackward() {
    if (fuel > 0) {
        updateSpeed(speed - 10);
        updateFuel(); // 연료 감소
        tank.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    } else {
        alert('연료가 부족합니다!');
    }
}

// 탱크를 왼쪽으로 회전시키는 함수
function turnLeft() {
    angle -= 15;
    tank.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

// 탱크를 오른쪽으로 회전시키는 함수
function turnRight() {
    angle += 15;
    tank.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

// 포신 각도를 변경하는 함수
function updateGunAngle() {
    gunAngle = gunAngleSlider.value;
    gunAngleDisplay.textContent = gunAngle;
    gun.style.transform = `rotate(${gunAngle}deg)`; // 포신 회전
}

// 사격 함수
function fire() {
    if (ammo > 0) {
        alert('발사!');
    } else {
        alert('탄환이 없습니다!');
    }
}

// 이벤트 리스너 등록
document.getElementById('moveForward').addEventListener('click', moveForward);
document.getElementById('moveBackward').addEventListener('click', moveBackward);
document.getElementById('turnLeft').addEventListener('click', turnLeft);
document.getElementById('turnRight').addEventListener('click', turnRight);
document.getElementById('fire').addEventListener('click', fire);
gunAngleSlider.addEventListener('input', updateGunAngle);
