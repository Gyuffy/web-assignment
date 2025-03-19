import socket
import threading
import json
from dotenv import load_dotenv
import os
import time
import random

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
}

send_data = True  # 데이터 전송 플래그
lock = threading.Lock()  # 멀티스레드 환경에서 안전한 상태 변경을 위한 Lock


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
                            send_data = (
                                value == "on"
                            )  # power가 "off"이면 데이터 전송 중지
                        elif key == "language" and value not in ["eng", "kor"]:
                            raise ValueError(
                                "Invalid language value. Must be 'eng' or 'kor'."
                            )
                        elif key == "cur_dir" :
                            try:
                                dir_int = int(value)
                                if not (-100 <= dir_int <= 100):
                                    raise ValueError(
                                        "Invalid current direction value. Must be between -100 and 100."
                                    )
                                robot_status[key] = str(dir_int)
                            except ValueError:
                                raise ValueError(
                                    "Invalid current direction value. Must be between -100 and 100."
                                )
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


def connect_to_server():
    try:
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((HOST, PORT))
        print(f"Connected to {HOST}:{PORT}")

        thread1 = threading.Thread(target=set_robot_status, args=(client_socket,))
        thread2 = threading.Thread(target=send_robot_status, args=(client_socket,))

        thread1.start()
        thread2.start()

        thread1.join()
        thread2.join()
    except Exception as e:
        print(f"Failed to connect: {e}")


if __name__ == "__main__":
    connect_to_server()
