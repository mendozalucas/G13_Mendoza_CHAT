const IP = "ws://localhost:3000";
const socket = io(IP);

socket.on("connect", () => {
    console.log("Me conecté a WS");
});
/*
socket.on("server-message", data => {
    console.log("Me llego del servidor", data);
});*/

function funcionPruebaa() {
    socket.emit("incoming-message", { mensaje: "PRUEBA"});
}

function emitMessage() {
    let mensaje = getMessageContent()
    socket.emit("incoming-message", { mensaje: mensaje});
}
/*
io.on("connection", socket => {

    socket.join("some room");
    
    io.to("some room").emit("server-message", { mensaje: data.mensaje, user: req.session.Dato });
});*/

socket.on("server-message", data => {
  console.log("Me llego del servidor", data.mensaje);
  console.log("Me llego del servidor", data.user);
  let getMensaje = data.mensaje;
  let getUser = data.user;
  mandarMensaje(getMensaje, getUser);
});


function unirmeAlChat(id) {
    socket.emit("join-chat", { idchat: id});
}

socket.on("server-chat", data => {
    console.log("Me llego del servidor", data.mensaje);
    mandarMensaje(data.mensaje, "Servidor");
  });
  