import { WebSocketServer } from "ws";

export default function createWebSocketServer(server) {
  const group = {};
  function sendMessage(message, room) {
    group[room].forEach((user) => {
      user.ws.send(JSON.stringify(message));
    });
  }
  const WssServer = new WebSocketServer({ server }, () => {
    console.log("Websocket started");
  });

  WssServer.on("connection", (ws) => {
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
}
