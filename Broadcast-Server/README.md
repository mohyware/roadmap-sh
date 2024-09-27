# Broadcast-Server
![screenshot1](./screenshots/Screenshot(1).png)
---
![screenshot2](./screenshots/Screenshot(2).png)
---
![screenshot3](./screenshots/Screenshot(3).png)
---
## Overview
The Broadcast-Server is a real-time communication server that enables multiple clients to connect and exchange messages. It tracks connected clients, broadcasts messages with the sender's name, and provides an online user count. The server manages client disconnections seamlessly and includes an HTML interface for testing its functionality.
## Features
- **Real-Time Communication**: Clients can send messages to the server, and the server broadcasts these messages to all connected clients, enabling real-time communication.
- **Client Name Handling**: Each client is identified by a  name, and messages are broadcasted with the client's name attached.
- **Connection Management**: The server keeps track of all active clients and stores their connections in a list.
- **Graceful Disconnections**: When a client disconnects, the server automatically removes the client from the list of connected clients, ensuring a clean state.
- **Online User Count**: The server maintains and provides an up-to-date count of the users currently connected to the server.
- **HTML Interface**: An HTML frontend is provided to test the server's functionality, allowing clients to connect, send messages, and view the list of active users.

## How to run this project
1. Clone this repository
2. Run `npm install`
3. Create a `.env` file and add the following:
```
PORT=3000
```
4. Run `node app`
The application will be accessible at http://localhost:3000.
## Project Url
https://roadmap.sh/projects/markdown-note-taking-app