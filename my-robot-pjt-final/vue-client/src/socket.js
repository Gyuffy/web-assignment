// src/socket.js
let socket = null;

export function initSocket(url) {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url);
    console.log("🌐 WebSocket initialized globally");
  }
  return socket;
}

export function getSocket() {
  return socket;
}

export function sendMessage(messageObj) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(messageObj));
  } else {
    console.warn("WebSocket is not connected.");
  }
}
