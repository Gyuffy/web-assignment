import { defineStore } from "pinia";
import { ref } from "vue";

export const useSocketStore = defineStore("socket", () => {
  const socket = ref(null);
  const isConnected = ref(false);
  const lastMessage = ref(null);

  const connect = (url) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) return;

    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      console.log("✅ WebSocket connected");
      isConnected.value = true;
    };

    socket.value.onmessage = (event) => {
      lastMessage.value = event.data;
    };

    socket.value.onclose = () => {
      console.log("❌ WebSocket disconnected");
      isConnected.value = false;
    };

    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const sendMessage = (data) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open.");
    }
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
    }
  };

  return {
    socket,
    isConnected,
    lastMessage,
    connect,
    sendMessage,
    disconnect,
  };
});
