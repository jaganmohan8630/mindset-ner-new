import { io } from "socket.io-client";
import { SOCKET_URL } from "./api";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("mindset_ner_token"),
  },
});

export default socket;