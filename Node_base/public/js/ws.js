const IP = "ws://localhost:3000";
const socket = io(IP);

socket.on("connect", () => {
    console.log("Me conecté a WS");
});

socket.on("server-message", data => {
    console.log("Me llego del servidor", data);
});

function funcionPruebaa() {
    socket.emit("incoming-message", { mensaje: "PRUEBA"});
}
/*
function emitMessage(id) {
    const el_mensaje = document.getElementById("mensaje" + id).value;
    let mensaje = el_mensaje;
    socket.emit("incoming-message", { mensaje: mensaje});
}*/
/*
function emitUpload(id_chat_2, id_usuario_) {
    const id_chat_upload = id_chat_2;
    const id_usuario_upload = id_usuario_;
    socket.emit("upload-messages", {upload_chat: id_chat_upload, upload_usuario: id_usuario_upload})
}*/
/*
io.on("connection", socket => {

    socket.join("some room");
    
    io.to("some room").emit("server-message", { mensaje: data.mensaje, user: req.session.Dato });
});*/
