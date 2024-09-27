//Websocekt variables
const url = "ws://localhost:3000/myWebsocket"
const mywsServer = new WebSocket(url)
let userName = prompt("Enter your name:") || "Anonymous User";
//DOM Elements
const myMessages = document.getElementById("messages")
const myInput = document.getElementById("message")
const sendBtn = document.getElementById("send")
const countBtn = document.getElementById("count")

sendBtn.disabled = true
sendBtn.addEventListener("click", sendMsg, false)

countBtn.disabled = true
countBtn.addEventListener("click", getCount, false)

//Sending message from client
function sendMsg() {
    const text = myInput.value
    msgGeneration(text, `${userName}`)
    mywsServer.send(JSON.stringify({ from: userName, data: text }));
}

//Sending message from client
function getCount() {
    mywsServer.send(JSON.stringify({ from: userName, data: "getCount" }));
}

//Creating DOM element to show received messages on browser page
function msgGeneration(msg, from) {
    const newMessage = document.createElement("h5")
    newMessage.innerText = `${from} : ${msg}`
    myMessages.appendChild(newMessage)
}

//enabling send message when connection is open
mywsServer.onopen = function () {
    mywsServer.send(JSON.stringify({ from: userName, data: "NewUserJoined" }));
    sendBtn.disabled = false
    countBtn.disabled = false

}

//handling message event
mywsServer.onmessage = function (event) {
    const message = JSON.parse(event.data);
    if (message.data === "joinedClient") {
        console.log("hsh");
        msgGeneration(`has joined the server ! (${message.count}) online`, message.from)
    }
    else if (message.data === "getCount") {
        msgGeneration(` (${message.count}) `, `${message.from} asked for online users`)
    }
    else {
        console.log("New message:", message.data);
        msgGeneration(message.data, `${message.from}  `)
    }
}