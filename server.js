const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const http = require("http");

const app = express();
const { createGameState, gameLoop, getUpdatedVelocity } = require("./game");
const { frameRate } = require("./constant");

const server = http.createServer(app);
app.use(cors());

const io = socketio(server);

io.on("connection", (socket) => {
  const state = createGameState();
  socket.on("keycode", handleDown);

  function handleDown(keyCode) {
    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.log(error);
      return;
    }

    const vel = getUpdatedVelocity(keyCode);
    if (vel) {
      state.player.vel = vel;
    }
  }

  startGameInterval(socket, state);
});

startGameInterval = (socket, state) => {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state, socket);

    if (!winner) {
      socket.emit("gameState", JSON.stringify(state));
    } else {
      socket.emit("gameOver");
      clearInterval(intervalId);
    }
  }, 1000 / frameRate);
};
server.listen(3001, () => {
  console.log("running on 3001");
});
