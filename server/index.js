import { WebSocketServer } from "ws";
const group = {};

function sendMessage(message, room) {
  group[room].forEach((user) => {
    user.ws.send(JSON.stringify(message));
  });
}
const server = new WebSocketServer(
  {
    port: 8080,
  },
  () => {
    console.log("Server started on port 8080");
  }
);

server.on("connection", (ws) => {
  // users.add(userRef);
  const userRef = {
    ws,
  };
  ws.on("message", (message) => {
    try {
      // Parsing the message
      const data = JSON.parse(message);
      // Checking if the message is a valid one

      if (data.initial) {
        if (group[data.room] === undefined) {
          const users = new Set();
          group[data.room] = users;
        }

        group[data.room].add(userRef);
        console.log("wow", group[data.room].size);
        // group[data.room].add(userRef);
        return;
      }

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

      sendMessage(messageToSend, data.room);
    } catch (e) {
      console.error("Error passing message!", e);
    }
  });

  ws.on("close", (params, reason) => {
    // const lol = JSON.parse(reason.toJSON);
    console.log("dher", reason.toJSON);
    // group[reason].delete(userRef);
    console.log(`Connection closed!`);
  });
});
