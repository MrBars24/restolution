const http = require("http");

const { Server } = require("socket.io");

const httpServer = http.createServer();

const PORT = 8001,
  HOST = "localhost";

const io = new Server(httpServer, {
  cors: {
    origin: "*", // or a list of origins you want to allow, e.g. ["http://localhost:3000"]
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

httpServer.listen(PORT, HOST, () => {
  console.log("Server running on port:", PORT);
});