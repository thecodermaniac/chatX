const WebSocket = require("ws");

const users = new Set();

function sendMessage(message) {
  users.forEach((user) => {
    user.ws.send(JSON.stringify(message));
  });
}
console.log(Date.now());
const server = new WebSocket.Server(
  {
    port: 8080,
  },
  () => {
    console.log("Server started on port 8082");
  }
);

server.on("connection", (ws) => {
  console.log("ws", ws);
  const userRef = {
    ws,
  };
  users.add(userRef);
  console.log("users", users);

  ws.on("message", (message) => {
    console.log(message);
    try {
      // Parsing the message
      console.log("msg", message);
      const data = JSON.parse(message);
      console.log("real", data);
      // Checking if the message is a valid one

      if (typeof data.sender !== "string" || typeof data.body !== "string") {
        console.error("Invalid message");
        return;
      }

      // Sending the message

      const messageToSend = {
        sender: data.sender,
        body: data.body,
        sentAt: Date.now(),
      };

      sendMessage(messageToSend);
    } catch (e) {
      console.error("Error passing message!", e);
    }
  });

  ws.on("close", (code, reason) => {
    users.delete(userRef);
    console.log(`Connection closed: ${code} ${reason}!`);
  });
});
