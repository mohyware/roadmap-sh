const WebSocket = require("ws");
const express = require("express");
const app = express()
const path = require("path")
require("dotenv").config()

app.use("/", express.static(path.resolve(__dirname, "../Broadcast-Server/views")))

const myServer = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

const wsServer = new WebSocket.Server({
    noServer: true
})

clients = new Map();

wsServer.on("connection", function (ws, req) {
    ws.on("message", function (message) {
        const parsedMessage = JSON.parse(message);
        const userName = parsedMessage.from;
        const data = parsedMessage.data;

        if (data === "NewUserJoined") {
            const ip = req.socket.remoteAddress;
            clients.set(ws, { ip, userName });
            console.log(userName, " joined");
            ws.send(JSON.stringify({ from: userName, data: "joinedClient", count: clients.size }));
        }
        else if (data === "getCount") {
            console.log(clients.size, " Online");
            ws.send(JSON.stringify({ from: userName, data: "getCount", count: clients.size }));
        }
        else {
            console.log(`Received: ${data}`);
            wsServer.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                    client.send(JSON.stringify({ from: userName, data: data }));
                }
            })
        }
    })
    ws.on('close', () => {
        const user = clients.get(ws);
        const { userName } = user;
        clients.delete(ws);
        console.log(userName, "disconnected");
    });
})


myServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event

    wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit('connection', ws, request);
    });
});
