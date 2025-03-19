import socket
import threading
import json
from dotenv import load_dotenv
import os

# .env.local 파일에서 환경 변수 로드
load_dotenv(".env.local")

# 환경 변수에서 HOST와 PORT 읽기
HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))

simulator_status = {
    # on/off
    "power": "on",
    # eng/kor
    "language": "eng",
    # up/down/left/right
    "cur_dir": "up",
    # 0 - 100
    "speed": "30",
    # client flag
    "client_message": "false",
}

# 멀티쓰레드
# TCP로 메세지 들어옴(JSON 명령 형태이지만 buffer 이므로 JSON 으로 변환 필요)
# 만약 simulator_status 에 존재하는 키 값이고,
# 적합한 데이터 형태라면
# simulator_status 변경 후, 아래 문구 출력
# simulator_status is changed successfully.
# 이후, simulator_status 를 잘 볼 수 있도록 터미널에 출력
# 만약 적합하지 않은 데이터 형태라면 예외처리
def set_simulator_status(client_socket):
    while True:
        try:
            data = client_socket.recv(1024)
            if not data:
                break

            message = json.loads(data.decode("utf-8"))
            if isinstance(message, dict):
                for key, value in message.items():
                    if key in simulator_status:
                        if key == "power" and value not in ["on", "off"]:
                            raise ValueError(
                                "Invalid power value. Must be 'on' or 'off'."
                            )
                        elif key == "language" and value not in ["eng", "kor"]:
                            raise ValueError(
                                "Invalid language value. Must be 'eng' or 'kor'."
                            )
                        elif key == "cur_dir" and value not in [
                            "up",
                            "down",
                            "left",
                            "right",
                        ]:
                            raise ValueError(
                                "Invalid cur_dir value. Must be 'up', 'down', 'left', or 'right'."
                            )
                        elif key == "speed":
                            try:
                                speed_int = int(value)  # Convert string to integer
                                if not (0 <= speed_int <= 100):
                                    raise ValueError(
                                        "Invalid speed value. Must be between 0 and 100."
                                    )
                                simulator_status[key] = str(speed_int)  # Store as string
                            except ValueError:
                                raise ValueError(
                                    "Invalid speed value. Must be a string representing an integer between 0 and 100."
                                )
                        else:
                            simulator_status[key] = value
                print("simulator_status is changed successfully.")
                print(json.dumps(simulator_status, indent=4))
            else:
                print("Invalid data format received.")
        except json.JSONDecodeError:
            print("Received invalid JSON data.")
        except ValueError as ve:
            print(f"Value error: {ve}")
        except Exception as e:
            print(f"Error in set_robot_status: {e}")

# 서버 소켓 접속 함수
def connect_to_server():
    try:
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((HOST, PORT))
        print(f"Connected to {HOST}:{PORT}")

        thread = threading.Thread(target=set_simulator_status, args=(client_socket,))

        thread.start()

        thread.join()
    except Exception as e:
        print(f"Failed to connect: {e}")

if __name__ == "__main__":
    connect_to_server()

