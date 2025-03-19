import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import net from "net";

const app = express();
const WEB_PORT = 8000;
const TCP_SOCKET_PORT = 9000;

// REST 함수가 들어갈 영역
// ... 
// ...

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

let tcpSocketClients = []; // TCP Socket 클라이언트를 저장할 배열
let webSocketClients = []; // Web Socket 클라이언트를 저장할 배열

// TCP Socket 서버 설정
const tcpSocketServer = net.createServer((socket) => {
  console.log("TCP Socket client connected");

  // TCP Socket 클라이언트 목록에 추가
  tcpSocketClients.push(socket);

  socket.on("data", (data) => {
    // console.log("Received from TCP Socket client: ", data.toString());

    // TCP 클라이언트에게 브로드캐스트 (시뮬레이터 => 로봇 || 로봇 => 시뮬레이터)
    tcpSocketClients.forEach((tcpSocketClient) => {
      // 자기 자신에게는 메시지 보내지 않음
      if (tcpSocketClient !== socket) {
        tcpSocketClient.write(data);
      }
    });

    // WebSocket 클라이언트에게 브로드캐스트 (로봇 => 대시보드 || 시뮬레이터 => 대시보드)
    webSocketClients.forEach((webSocketClient) => {
      webSocketClient.send(data);
    });
  });

  socket.on("end", () => {
    console.log("TCP client disconnected");
    // tcpSocketClients 배열에서 제거
    tcpSocketClients = tcpSocketClients.filter(
      (tcpSocketClient) => tcpSocketClient !== socket
    );
  });
});

// Web Socket 서버 설정
wss.on("connection", (ws) => {
  console.log("Web Socket client connected");

  // WebSocket 클라이언트 목록에 추가
  webSocketClients.push(ws);

  ws.on("message", (message) => {
    // console.log("Received from Web Socket client: ", message.toString());

    // Web Socket 클라이언트에게 브로드캐스트 (대시보드 => 대시보드)
    // 자기 자신에게도 그대로 돌려보냄. 로그 출력용.
    webSocketClients.forEach((webSocketClient) => {
      // 만약 자기자신한테 안 보내고 싶다면
      // if (webSocketClient !== ws) {
      //   webSocketClient.send(message);
      // }
      webSocketClient.send(message);
    });

    // TCP 클라이언트에게 브로드캐스트 (대시보드 => 로봇 || 대시보드 => 시뮬레이터)
    tcpSocketClients.forEach((tcpSocketClient) => {
      tcpSocketClient.write(message);
    });
  });

  ws.on("close", () => {
    console.log("Web Socket client disconnected");
    // Web Socket 클라이언트 목록에서 제거
    webSocketClients = webSocketClients.filter(
      (webSocketClient) => webSocketClient !== ws
    );
  });
});

// TCP Socket 서버 시작
tcpSocketServer.listen(TCP_SOCKET_PORT, () => {
  console.log(`TCP Socket server listening on port ${TCP_SOCKET_PORT}`);
});

// Web 서버 시작 (REST + Web Socket)
server.listen(WEB_PORT, () => {
  console.log(`Web server listening on port ${WEB_PORT}`);
});

