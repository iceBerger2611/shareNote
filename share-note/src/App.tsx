import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { io, Socket } from "socket.io-client";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const socketRef = useRef<Socket | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMsg(e.target.value);
  };

  const onClick = () => {
    if (!currentMsg.trim() || !socketRef.current) return;

    if (socketRef.current.connected) {
      socketRef.current.emit("chat message", currentMsg);
    } else {
      // Wait until connected, then emit
      socketRef.current.once("connect", () => {
        socketRef.current?.emit("chat message", currentMsg);
      });
    }

    setCurrentMsg("");
  };
  useEffect(() => {
    if (socketRef.current) return;

    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected!", socket.id);
    });

    socket.on("chat message", (msg: string) => {
      setMessages((prev) => [msg, ...prev]);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </div>
      <input id="input" onChange={onChange} value={currentMsg} />
      <button onClick={onClick}>send</button>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
