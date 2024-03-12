"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chessboard } from "react-chessboard";

const WebSocketComponent: React.FC = () => {
  const [msgToSend, setmsgToSend] = useState("");
  const [socketData, setSocketData] = useState<string>("");
  const [conn, setConn] = useState<WebSocket | null>(null);
  const [uuid, setUuid] = useState("No game");
  const [gameFen, setGameFen] = useState();

  const newGame = async () => {
    // setUuid(msgToSend);
    try {
      let response = await axios.get(
        `http://localhost:8080/newgame/${msgToSend}`
      );

      if (response.status === 200) {
        console.log("New game created successfully");

        // socket
        const socket = new WebSocket(
          `ws://localhost:8080/player1/${msgToSend}`
        ); // Replace with your WebSocket server URL
        setConn(socket);
        socket.onopen = () => {
          console.log("WebSocket connected");
        };
        socket.onmessage = (event) => {
          setSocketData(event.data);
          setGameFen(event.data);
          console.log(socketData);
        };
        socket.onclose = () => {
          console.log("WebSocket disconnected");
        };
        // handle closing of socket
      } else {
        console.error("Failed to create new game:", response.statusText);
        // Handle error response here
      }
    } catch (error) {
      console.error("Error creating new game:", error);
      // Handle any other errors here
    }
  };

  const joinGame = async () => {
    // socket
    const socket = new WebSocket(`ws://localhost:8080/player2/${msgToSend}`); // Replace with your WebSocket server URL
    setConn(socket);
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    socket.onmessage = (event) => {
      setSocketData(event.data);
      setGameFen(event.data);
      console.log(socketData);
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  // handle closing of socket

  const handlePieceDrop = (from: string, to: string) => {
    conn?.send(`${from}${to}`);
    setGameFen(gameFen);
    return true;
  };

  return (
    <div className=" flex">
      <div className="w-[42vw] p-4">
        <Chessboard
          id="BasicBoard"
          onPieceClick={(piece) => console.log(piece)}
          onSquareClick={(square) => console.log(`Clicked square ${square}`)}
          onPieceDrop={handlePieceDrop}
          position={gameFen}
        />
      </div>

      <div className=" flex flex-col gap-2  h-full pl-4 ">
        <h1 className="">Enter data to send</h1>
        <input
          type="text"
          onChange={(event) => {
            setmsgToSend(event.target.value);
          }}
          className=" border-2 border-black "
        />
        <button
          onClick={() => {
            conn?.send(msgToSend);
          }}
          className=" p-2 border-2 border-black "
        >
          Send
        </button>
        <div className=" flex flex-row pt-2">
          <h1>Data recived from server : </h1>
          <p className=" border-2 border-black px-3">{socketData}</p>
        </div>
        <div className=" flex items-center gap-2 ">
          <div className=" gap-2 flex ">
            <button
              onClick={newGame}
              className="border-2 border-black p-2 text-xl"
            >
              Create game
            </button>
            <button
              onClick={joinGame}
              className="border-2 border-black p-2 text-xl"
            >
              Join game
            </button>
            <input
              type="text"
              onChange={(event) => {
                setmsgToSend(event.target.value);
              }}
              className="p-2  border-2 border-black "
            />
            <span>Game code : {msgToSend}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketComponent;