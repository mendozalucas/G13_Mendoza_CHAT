const IP = "ws://localhost:3000";
const socket = io(IP);

socket.on("connect", () => {
    console.log("Me conecté a WS");
});

socket.on("server-message", data => {
    console.log("Me llego del servidor", data);
});

function funcionPrueba() {
    socket.emit("incoming-message", { mensaje: "PRUEBA"});
}

function emitMessage() {
    let mensaje = getMessageContent()
    socket.emit("incoming-message", { mensaje: mensaje});
}