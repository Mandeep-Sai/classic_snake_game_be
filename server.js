const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const scoreRoutes = require("./scores");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
const { createGameState, gameLoop, getUpdatedVelocity } = require("./game");
const { frameRate } = require("./constant");

const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use("/scores", scoreRoutes);

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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(process.env.PORT || 3001, () => {
      console.log(`working on port 3001`);
    })
  );
mongoose.connection.on("connected", () => {
  console.log("connected to atlas");
});
