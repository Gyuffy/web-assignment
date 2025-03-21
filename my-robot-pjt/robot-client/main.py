import socket
import threading
import json
import os
import time
import random
import RPi.GPIO as GPIO
from dotenv import load_dotenv

# GPIO 설정
LED_PIN = 17  # 사용할 GPIO 핀 번호
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.output(LED_PIN, GPIO.LOW)  # 초기 상태: OFF

SERVO_PIN = 18  # ✅ 서보모터 PWM 핀
GPIO.setup(SERVO_PIN, GPIO.OUT)
servo_pwm = GPIO.PWM(SERVO_PIN, 50)  # 50Hz PWM
servo_pwm.start(0)  # 초기 duty cycle

# 환경 변수 로드
load_dotenv(".env.local")

# 환경 변수에서 HOST와 PORT 읽기
HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))

robot_status = {
    "power": "on",  # "off"이면 속도 전송 중지
    "language": "eng",
    "cur_dir": "0",
    "speed": "30",
    "client_message": "false",
    "neck_angle": "90",
}

send_data = True  # 데이터 전송 플래그
lock = threading.Lock()  # 멀티스레드 환경에서 안전한 상태 변경을 위한 Lock

# LED 점멸 제어 이벤트 (이벤트 루프)
led_event = threading.Event()

# LED 점멸 함수
def blink_led():
    while True:
        if robot_status["power"] == "on":
            GPIO.output(LED_PIN, GPIO.HIGH)
            time.sleep(0.5)
            GPIO.output(LED_PIN, GPIO.LOW)
            time.sleep(0.5)
        else:
            GPIO.output(LED_PIN, GPIO.LOW)  # power가 off면 LED 끄기
            time.sleep(0.1)  # 대기하면서 CPU 사용량 절약

def set_servo_angle(angle):
    # 각도(0~180)를 PWM 듀티사이클(2~12)로 변환
    try:
        angle = max(0, min(180, int(angle)))
        duty = 2 + (angle / 18)
        servo_pwm.ChangeDutyCycle(duty)
        print(f"🔧 Servo angle set to {angle}° (duty: {duty:.2f})")
    except Exception as e:
        print(f"❌ Error setting servo angle: {e}")

# TCP 메시지 수신 및 상태 업데이트
def set_robot_status(client_socket):
    global send_data

    while True:
        try:
            data = client_socket.recv(1024)
            if not data:
                break

            message = json.loads(data.decode("utf-8"))

            if isinstance(message, dict):
                with lock:  # 상태 변경 시 Lock 사용
                    for key, value in message.items():
                        if key not in robot_status:
                            raise KeyError(
                                f"Invalid key: {key}. Key not found in robot_status."
                            )
                        if key == "power":
                            if value not in ["on", "off"]:
                                raise ValueError(
                                    "Invalid power value. Must be 'on' or 'off'."
                                )
                            robot_status["power"] = value
                            send_data = (value == "on")  # power가 "off"이면 데이터 전송 중지

                            # LED 점멸 이벤트 제어
                            if value == "on":
                                print("LED Event: ON")
                                led_event.set()  # LED 점멸 시작
                            else:
                                print("LED Event: OFF")
                                led_event.clear()  # LED 점멸 중지
                                GPIO.output(LED_PIN, GPIO.LOW)  # 안전하게 LED 끄기

                        elif key == "language" and value not in ["eng", "kor"]:
                            raise ValueError("Invalid language value. Must be 'eng' or 'kor'.")
                        elif key == "cur_dir" :
                            try:
                                dir_int = int(value)
                                if not (-100 <= dir_int <= 100):
                                    raise ValueError("Invalid current direction value. Must be between -100 and 100." )
                                robot_status[key] = str(dir_int)
                            except ValueError:
                                raise ValueError("Invalid current direction value. Must be between -100 and 100.")
                        elif key == "speed":
                            try:
                                speed_int = int(value)
                                if not (0 <= speed_int <= 100):
                                    raise ValueError(
                                        "Invalid speed value. Must be between 0 and 100."
                                    )
                                robot_status[key] = str(speed_int)
                            except ValueError:
                                raise ValueError(
                                    "Invalid speed value. Must be an integer between 0 and 100."
                                )
                        
                        elif key == "neck_angle":
                            try:
                                angle_int = int(value)
                                if not(0<= angle_int <= 180):
                                    raise ValueError("neck_angle must be between 0 and 180.")
                                robot_status[key] = str(angle_int)
                                set_servo_angle(angle_int)
                            except ValueError:
                                raise ValueError("Invalid neck_angle. Must be integer 0~180.")
                        else:
                            robot_status[key] = value

                print("robot_status is changed successfully.")
                print(json.dumps(robot_status, indent=4))

        except json.JSONDecodeError:
            print("Received invalid JSON data.")
        except KeyError as ke:
            print(f"Key error: {ke}")
        except ValueError as ve:
            print(f"Value error: {ve}")
        except Exception as e:
            print(f"Error in set_robot_status: {e}")

# 주기적으로 robot_status 전송
def send_robot_status(client_socket):
    global send_data

    while True:
        try:
            time.sleep(1)

            with lock:
                if not send_data:  # power가 "off"이면 전송 중지
                    continue

                robot_status["speed"] = str(random.randint(0, 100))  # 랜덤 속도 설정
                robot_status["cur_dir"] = str(random.randint(-100, 100))
                robot_status["client_message"] = "false"

            message = json.dumps(robot_status)
            client_socket.sendall(message.encode("utf-8"))
            print(f"Sent: {message}")

        except Exception as e:
            print(f"Error in send_robot_status: {e}")
            break

# 서버 연결 및 스레드 실행
def connect_to_server():
    try:
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((HOST, PORT))
        print(f"Connected to {HOST}:{PORT}")

        thread1 = threading.Thread(target=set_robot_status, args=(client_socket,))
        thread2 = threading.Thread(target=send_robot_status, args=(client_socket,))
        thread3 = threading.Thread(target=blink_led, daemon=True)  # LED 점멸 스레드 실행

        thread1.start()
        thread2.start()
        thread3.start()

        thread1.join()
        thread2.join()
    except Exception as e:
        print(f"Failed to connect: {e}")
    finally:
        GPIO.cleanup()  # 프로그램 종료 시 GPIO 핀 초기화


if __name__ == "__main__":
    connect_to_server()